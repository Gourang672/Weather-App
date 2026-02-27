import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
	constructor(private readonly chatbotService: ChatbotService) {}

	@Post('chat')
	async chat(@Body() body: { message: string; city?: string }) {
		const result = await this.chatbotService.getChatResponse(body);
		return result;
	}
}
