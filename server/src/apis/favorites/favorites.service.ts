import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite, FavoriteDocument } from '../../schemas/favorites.schema';

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>) {}

  async create(createFavoriteDto: CreateFavoriteDto, userId: string) {
    const created = await this.favoriteModel.create({ city: createFavoriteDto.cityId, user: userId });
    const result = await this.favoriteModel.findById(created._id).populate('city').exec();
    return result;
  }

  async findAll(userId: string) {
    const favorites = await this.favoriteModel.find({ user: userId }).populate('city').exec();
    
    const validFavorites = favorites.filter(fav => fav.city !== null);
    
    return validFavorites;
  }

  async findOne(id: string, userId: string) {
    const favorite = await this.favoriteModel.findOne({ _id: id, user: userId }).populate('city').exec();
    if (!favorite) throw new Error('Favorite not found');
    return favorite;
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto, userId: string) {
    return this.favoriteModel.findOneAndUpdate({ _id: id, user: userId }, updateFavoriteDto, { returnDocument: 'after' }).populate('city').exec();
  }

  async remove(id: string, userId: string) {
    return this.favoriteModel.findOneAndDelete({ _id: id, user: userId }).exec();
  }
}
