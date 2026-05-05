import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  async summary(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getSummary(user.userId);
  }

  @Get('activity')
  async activity(@CurrentUser() user: AuthenticatedUser) {
    return this.analyticsService.getActivity(user.userId);
  }
}
