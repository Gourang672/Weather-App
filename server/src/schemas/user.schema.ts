import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ trim: true, required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true,type: String })
  password: string;

  @Prop({ required: true,type: String })
  location: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);

