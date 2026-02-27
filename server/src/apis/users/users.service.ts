import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users, UsersDocument } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<UsersDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: createUserDto.email });
    if (existing) throw new ConflictException('Email already registered');
    const saltRounds = 10;
    const hashed = await bcrypt.hash(createUserDto.password, saltRounds);

    const created = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashed,
      location: createUserDto.location || '',
      tempUnit: createUserDto.tempUnit || 'F',
      windUnit: createUserDto.windUnit || 'mph',
    });
    return created.save();
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const payload: any = { ...updateUserDto };
    if (updateUserDto.password) {
      const saltRounds = 10;
      payload.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    return this.userModel.findByIdAndUpdate(id, payload, { new: true }).select('-password').exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updatePassword(id: string, hashedPassword: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).select('-password').exec();
    
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
