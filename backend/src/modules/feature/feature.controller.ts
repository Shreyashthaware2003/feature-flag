import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post('flags')
  async create(
    @Body() dto: CreateFlagDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.featureService.create(dto, user.userId);
  }

  @Get('flags')
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.featureService.findAll(user.userId);
  }

  @Get('flags/:key')
  async findOne(
    @Param('key') key: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.featureService.getFlagWithRules(key, user.userId);
  }

  @Patch('flags/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateFlagDto>,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.featureService.update(id, dto, user.userId);
  }

  @Delete('flags/:id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.featureService.delete(id, user.userId);
  }
}
