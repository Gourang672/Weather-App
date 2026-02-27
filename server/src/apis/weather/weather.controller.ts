import { BadRequestException, Controller, Get, InternalServerErrorException, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('location') location: string) {
    if (!location) {
      throw new BadRequestException('Location query parameter is required');
    }
    
    try {
      return await this.weatherService.getWeather(location);
    } catch (error: any) {
      if (error.message === 'Location not found') {
        throw new BadRequestException('Location not found. Please check the spelling and try again.');
      }
      throw new InternalServerErrorException('Failed to fetch weather data');
    }
  }
}