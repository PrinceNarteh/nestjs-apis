import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema()
export class Tenant {}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
