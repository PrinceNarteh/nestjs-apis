import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { TenantDocument } from './schemas/tenant.schema';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  async getAllTenants(): Promise<TenantDocument[]> {
    return this.tenantsService.getAllTenants();
  }

  @Get(':id')
  async getTenantById(@Param('id') id: string): Promise<TenantDocument> {
    return this.tenantsService.getTenantById(id);
  }

  @Post()
  async createTenant(
    @Body() createTenantDto: CreateTenantDto,
  ): Promise<TenantDocument> {
    return this.tenantsService.create(createTenantDto);
  }
}
