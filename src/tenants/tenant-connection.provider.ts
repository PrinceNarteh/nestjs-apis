import { InternalServerErrorException, Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

export const tenantConnectionProvider: Provider = {
  provide: 'TENANT_CONNECTION',
  useFactory: (request, connection: Connection) => {
    if (request.tenantId) {
      throw new InternalServerErrorException(
        'Make sure to apply tenantsMiddleware',
      );
    }
    return connection.useDb(`tenant-${request.tenantId}`);
  },
  inject: [REQUEST, getConnectionToken()],
  scope: Scope.REQUEST,
};
