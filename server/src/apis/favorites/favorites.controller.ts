import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.favoritesService.create(createFavoriteDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.favoritesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.favoritesService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.favoritesService.update(id, updateFavoriteDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.favoritesService.remove(id, userId);
  }
}
