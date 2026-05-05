import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFlagDto } from './dto/create-flag.dto';

@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  // 🧾 CREATE FLAG
  @Post('flags')
  async create(@Body() dto: CreateFlagDto) {
    return this.featureService.create(dto);
  }

  // 📄 GET ALL FLAGS
  @Get('flags')
  async findAll() {
    return this.featureService.findAll();
  }

  // 📄 GET SINGLE FLAG
  @Get('flags/:key')
  async findOne(@Param('key') key: string) {
    return this.featureService.getFlagWithRules(key);
  }

  // ✏️ UPDATE FLAG
  @Patch('flags/:id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateFlagDto>) {
    return this.featureService.update(id, dto);
  }

  // ❌ DELETE FLAG
  @Delete('flags/:id')
  async delete(@Param('id') id: string) {
    return this.featureService.delete(id);
  }
}
