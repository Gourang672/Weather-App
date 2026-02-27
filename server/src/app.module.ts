import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { FavoritesModule } from './apis/favorites/favorites.module';
import { MailModule } from './apis/mail/mail.module';
import { CityModule } from './apis/city/city.module';
import { WeatherModule } from './apis/weather/weather.module';
import { ChatbotModule } from './apis/chatbot/chatbot.module';

@Module({
  imports: [
     ThrottlerModule.forRoot({ throttlers: [{ ttl: 60, limit: 20 }] }),
     ConfigModule.forRoot({
       isGlobal: true,
       envFilePath:['.env']
      }),
      MongooseModule.forRoot(process.env.MONGODB_URI),
      UsersModule,
      AuthModule,
      FavoritesModule,
      MailModule,
      CityModule,
      WeatherModule,
      ChatbotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
