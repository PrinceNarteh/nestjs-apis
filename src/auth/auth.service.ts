import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
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
    return this.generateUserTokens(user._id.toString());
  }

  async generateUserTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuid();
    await this.storeRefreshToken({ userId, token: refreshToken });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenModel.create({ token, userId, expiryDate });
  }
}
