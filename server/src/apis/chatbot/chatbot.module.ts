import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { WeatherModule } from '../weather/weather.module';

@Module({
	imports: [WeatherModule],
	controllers: [ChatbotController],
	providers: [ChatbotService],
})
export class ChatbotModule {}
