import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './user.schema';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
  user: Types.ObjectId;

  @Prop({ trim: true, required: true })
  city: string;

  @Prop({ trim: true, default: null })
  label?: string;

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

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

