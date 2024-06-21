import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { Model } from 'mongoose';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<Tenant>,
  ) {}

  async getTenantById(id: string): Promise<TenantDocument> {
    return this.tenantModel.findById(id);
  }
}
