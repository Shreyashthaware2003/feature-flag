import {
  ConflictException,
  ForbiddenException,
  Injectable,
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
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
}
