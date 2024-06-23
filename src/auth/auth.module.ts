import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
  ],
})
export class AuthModule {}
