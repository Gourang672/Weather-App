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
    const created = new this.favoriteModel({ ...createFavoriteDto, user: userId });
    return created.save();
  }

  async findAll(userId: string) {
    return this.favoriteModel.find({ user: userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const favorite = await this.favoriteModel.findOne({ _id: id, user: userId }).exec();
    if (!favorite) throw new Error('Favorite not found');
    return favorite;
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto, userId: string) {
    return this.favoriteModel.findOneAndUpdate({ _id: id, user: userId }, updateFavoriteDto, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    return this.favoriteModel.findOneAndDelete({ _id: id, user: userId }).exec();
  }
}
