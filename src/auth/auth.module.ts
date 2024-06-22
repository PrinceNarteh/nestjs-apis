import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Module({
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
