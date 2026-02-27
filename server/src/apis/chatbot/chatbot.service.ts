import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { WeatherService } from '../weather/weather.service';

interface ChatRequest {
	message: string;
	city?: string;
}

@Injectable()
export class ChatbotService {
	private readonly logger = new Logger(ChatbotService.name);
	constructor(private readonly weatherService: WeatherService) {}

	private buildSystemPrompt(cityWeather: any | null) {
		const weatherSummary = cityWeather
			? `Brief current conditions provided for the requested city (temperature, wind, humidity).`
			: 'No live weather context available.'

		return `You are a helpful weather assistant. Do NOT reveal raw dataset contents, file paths, or internal identifiers. Use the available weather context to answer succinctly: ${weatherSummary} If the user asks for advice, give short actionable guidance.`;
	}

	public async getChatResponse(body: ChatRequest) {
		const { message, city } = body;

		let cityWeather = null;
		if (city) {
			try {
				cityWeather = await this.weatherService.getWeather(city);
			} catch (e) {
				this.logger.warn('Failed to fetch weather for city ' + city + ': ' + String(e));
			}
		}

		const systemPrompt = this.buildSystemPrompt(cityWeather);

		// LangChain ChatOpenAI with API key from .env
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) throw new Error('OPENAI_API_KEY not set in .env');

		try {
			const model = new ChatOpenAI({
				apiKey,
				modelName: 'gpt-4o-mini',
				temperature: 0.7,
				maxTokens: 500,
			});

			// Invoke the model with system and user messages
			const response = await model.invoke([
				new SystemMessage(systemPrompt),
				new HumanMessage(message),
			]);

			const reply = response.content ?? '';
			return { reply };
		} catch (error: any) {
			this.logger.error('ChatbotService LangChain error', error?.stack ?? String(error));
			const errorMsg = error?.message ?? String(error);
			// If quota exceeded, provide a fallback response using weather data
			if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
				if (cityWeather) {
					const reply = `Today's weather in ${cityWeather.location}: ${cityWeather.current.temperature}°C, windspeed ${cityWeather.current.windspeed} m/s, humidity ${cityWeather.current.humidity ?? 'N/A'}%.`;
					return { reply };
				} else {
					return { reply: 'Please provide a city to get current weather information.' };
				}
			}
			return { reply: 'Sorry, an internal error occurred. Please try again later.' };
		}
	}
}
