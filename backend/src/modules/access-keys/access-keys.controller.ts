import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AccessKeysService } from './access-keys.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';

@Controller('access-keys')
export class AccessKeysController {
  constructor(private readonly accessKeysService: AccessKeysService) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAccessKeyDto,
  ) {
    return this.accessKeysService.create(user.userId, dto.name);
  }

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.accessKeysService.list(user.userId);
  }

  @Delete(':id')
  async revoke(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.accessKeysService.revoke(id, user.userId);
  }
}
