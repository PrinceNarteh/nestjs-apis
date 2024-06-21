import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { TenantDocument } from './schemas/tenant.schema';
import { IdDto } from 'src/common/dtos/id.dto';
import { UpdateTenantDto } from './dtos/update-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  async getAllTenants(): Promise<TenantDocument[]> {
    return this.tenantsService.getAllTenants();
  }

  @Get(':id')
  async getTenantById(@Param() { id }: IdDto): Promise<TenantDocument> {
    return this.tenantsService.getTenantById(id);
  }

  @Post()
  async createTenant(
    @Body() createTenantDto: CreateTenantDto,
  ): Promise<TenantDocument> {
    return this.tenantsService.create(createTenantDto);
  }

  @Patch(':id')
  async updateTenant(
    @Param() { id }: IdDto,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDocument> {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  async deleteTenant(@Param() { id }: IdDto): Promise<TenantDocument> {
    return this.tenantsService.delete(id);
  }
}
