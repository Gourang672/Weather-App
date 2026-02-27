import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from '../../schemas/city.schema';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>) {}

  async create(createCityDto: CreateCityDto, userId: string) {
    const created = new this.cityModel({ ...createCityDto, user: userId });
    return created.save();
  }

  async findAll(userId: string) {
    return this.cityModel.find({ user: userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const city = await this.cityModel.findOne({ _id: id, user: userId }).exec();
    if (!city) throw new Error('City not found');
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto, userId: string) {
    return this.cityModel.findOneAndUpdate({ _id: id, user: userId }, updateCityDto, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    return this.cityModel.findOneAndDelete({ _id: id, user: userId }).exec();
  }
}
