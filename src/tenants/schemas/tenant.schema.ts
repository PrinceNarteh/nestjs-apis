import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema()
export class Tenant {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true, unique: true })
  tenantId: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
