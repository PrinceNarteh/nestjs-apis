import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class TenantsMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // checks if tenantId exists in the request headers
    const tenantId = req.headers['x-tenant-id']?.toString();
    if (!tenantId) {
      throw new BadRequestException('x-tenant-id not found');
    }

    const tenantExists = await this.tenantService.getTenantById(tenantId);
    if (!tenantExists) {
      throw new NotFoundException('Tenant does not exits');
    }

    // attach the tenantId to the request object
    req['tenantId'] = tenantId;
    next();
  }
}
