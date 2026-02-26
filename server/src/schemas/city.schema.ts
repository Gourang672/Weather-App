import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './user.schema';

export type CityDocument = HydratedDocument<City>;

@Schema({ timestamps: true })
export class City {
  @Prop({ trim: true, required: true, type: String })
   name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

