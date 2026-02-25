import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ trim: true, required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Boolean, default: null })
  deleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: Users.name, default: null })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Users.name, default: null })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Users.name, default: null })
  deletedBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(Users);

