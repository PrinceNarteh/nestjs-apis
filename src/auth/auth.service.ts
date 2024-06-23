import { BadRequestException, Injectable } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(userData: CreateUserDto) {
    const hashedPassword = await this.hashingService.hash(userData.password);
    return this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async signIn(userData: SignInDto) {
    let user = await this.usersService.findOne({ email: userData.email });
    if (
      user &&
      !(await this.hashingService.compare(userData.password, user.password))
    ) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
