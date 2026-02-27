import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ trim: true, required: true, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String, default: '' })
  location: string;

  @Prop({ required: true, enum: ['F','C'], default: 'F' })
  tempUnit: string;

  @Prop({ required: true, enum: ['mph','kmh'], default: 'mph' })
  windUnit: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);

