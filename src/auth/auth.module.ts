import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
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
