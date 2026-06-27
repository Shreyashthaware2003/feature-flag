import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import type { SignOptions } from 'jsonwebtoken';
import { MailService } from '../mail/mail.service';

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

type AuthResponse = {
  user: { id: string; email: string; full_name: string; isActive: boolean };
  tokens: TokenPair;
};

type JwtExpiresIn = NonNullable<SignOptions['expiresIn']>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) { }

  async signup(dto: SignupDto): Promise<AuthResponse> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      full_name: dto.full_name,
      passwordHash,
      isActive: true,
      refreshTokenHash: null,
    });
    const createdUser = await this.userRepo.save(user);
    void this.sendSignupEmailsInBackground({
      email: createdUser.email,
      full_name: createdUser.full_name,
    });

    const tokens = await this.generateTokens(createdUser.id, createdUser.email);
    await this.storeRefreshTokenHash(createdUser.id, tokens.refreshToken);

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        full_name: createdUser.full_name,
        isActive: createdUser.isActive,
      },
      tokens,
    };
  }

  private async sendSignupEmailsInBackground(user: {
    email: string;
    full_name: string;
  }): Promise<void> {
    const alertEmail = this.configService.get<string>('ALERT_TO_EMAIL');
    const dashboardUrl = 'https://flagpilot.vercel.app/dashboard';
    const tasks: Promise<unknown>[] = [];

    if (alertEmail) {
      const createdAt = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
        .format(new Date())
        .replace(',', '')
        .toLowerCase();

      tasks.push(
        this.mailService
          .renderTemplate('user-created-notify.html', {
            fullName: user.full_name,
            email: user.email,
            createdAt,
            dashboardUrl,
          })
          .then((notifyHtml) =>
            this.mailService.sendMail({
              to: alertEmail,
              subject: 'New user signup',
              text: `A new user signed up.\nName: ${user.full_name}\nEmail: ${user.email}`,
              html: notifyHtml,
            }),
          ),
      );
    } else {
      this.logger.warn(
        'ALERT_TO_EMAIL is not configured. Skipping admin signup alert email.',
      );
    }

    tasks.push(
      this.mailService
        .renderTemplate('account-created.html', {
          fullName: user.full_name,
          email: user.email,
          dashboardUrl,
        })
        .then((html) =>
          this.mailService.sendMail({
            to: user.email,
            subject: 'Welcome to Feature Flag App - Account Created',
            text: `Hi ${user.full_name}, your account has been created.`,
            html,
          }),
        ),
    );

    const results = await Promise.allSettled(tasks);
    const rejectedCount = results.filter(
      (result) => result.status === 'rejected',
    ).length;

    if (rejectedCount > 0) {
      this.logger.warn(
        `Signup completed for ${user.email}, but ${rejectedCount} email task(s) failed.`,
      );
      return;
    }

    this.logger.log(`Signup completed and email tasks finished for ${user.email}`);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'full_name', 'passwordHash', 'isActive'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    const isPasswordValid = await compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        isActive: user.isActive,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'full_name', 'isActive', 'refreshTokenHash'],
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    const isMatch = await compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        isActive: user.isActive,
      },
      tokens,
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepo.update({ id: userId }, { refreshTokenHash: null });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'full_name', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async validateAccessToken(token: string): Promise<{
    userId: string;
    email: string;
    isActive: boolean;
  }> {
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    let payload: { sub: string; email: string };
    try {
      const accessSecret =
        this.configService.get<string>('JWT_ACCESS_SECRET') ??
        'dev-access-secret';
      payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(
        token,
        { secret: accessSecret },
      );
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      select: ['id', 'email', 'isActive'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    return { userId: user.id, email: user.email, isActive: user.isActive };
  }

  private async storeRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenHash = await hash(refreshToken, 10);
    await this.userRepo.update({ id: userId }, { refreshTokenHash });
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ??
      'dev-access-secret';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      'dev-refresh-secret';
    const accessExpiresIn = (this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    ) ?? '15m') as JwtExpiresIn;
    const refreshExpiresIn = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) ?? '7d') as JwtExpiresIn;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: accessSecret, expiresIn: accessExpiresIn },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: refreshSecret, expiresIn: refreshExpiresIn },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<{
    sub: string;
    email: string;
  }> {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        'dev-refresh-secret';
      return await this.jwtService.verifyAsync<{ sub: string; email: string }>(
        refreshToken,
        { secret: refreshSecret },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async deleteUserByEmail(email: string) {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Valid email is required');
    }

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.remove(user);
    return { message: `${user.email} deleted successfully` }
  }
}
