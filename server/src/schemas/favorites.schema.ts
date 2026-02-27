import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './user.schema';
import { City } from './city.schema';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, trim: true, default: null })
  label?: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

