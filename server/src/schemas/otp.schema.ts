import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from './user.schema';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Boolean, default: false })
  used?: boolean;

  @Prop({ type: String, required: false })
  type?: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
