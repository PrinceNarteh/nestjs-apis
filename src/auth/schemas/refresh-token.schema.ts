import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiryDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
