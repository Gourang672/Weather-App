import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
