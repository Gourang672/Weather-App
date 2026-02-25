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

export const OtpSchema = SchemaFactory.createForClass(Otp);
