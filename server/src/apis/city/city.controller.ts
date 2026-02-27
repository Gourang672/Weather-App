import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('city')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.cityService.create(createCityDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.cityService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.cityService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.cityService.update(id, updateCityDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.cityService.remove(id, userId);
  }
}
