import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CreateTenantDto } from './dtos/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<Tenant>,
  ) {}

  async getAllTenants(): Promise<TenantDocument[]> {
    return this.tenantModel.find();
  }

  async getTenantById(id: string): Promise<TenantDocument> {
    return this.tenantModel.findById(id);
  }

  async create(createTenantDto: CreateTenantDto): Promise<TenantDocument> {
    return this.tenantModel.create({
      ...createTenantDto,
      tenantId: `tenant-${uuid()}`,
    });
  }
}
