import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { TENANT_CONNECTION } from './tenant-connection.provider';

export const PRODUCT_MODEL = 'PRODUCT_MODEL';

export const tenantModels: { [key: string]: Provider } = {
  productModel: {
    provide: 'PRODUCT_MODEL',
    inject: [TENANT_CONNECTION],
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Product.name, ProductSchema);
    },
  },
};
