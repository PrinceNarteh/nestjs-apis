import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Token } from 'src/types/token';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { UsersRepository } from 'src/users/users.repository';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepository,
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

  async signIn(userData: SignInDto): Promise<Token> {
    let user = await this.usersService.findOne({ email: userData.email });
    if (
      user &&
      !(await this.hashingService.compare(userData.password, user.password))
    ) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.generateUserTokens(user._id.toString());
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.usersService.findById(userId);
    const isMatch = this.hashingService.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const hashedPassword = await this.hashingService.hash(newPassword);
    user.password = hashedPassword;
    user.save();

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersRepo.findOne({
      email: forgotPasswordDto.email,
    });
    if (user) {
      const resetToken = nanoid(64);
    }
    return { message: 'Reset link has been sent to your email' };
  }

  async refreshToken(refreshToken: string): Promise<Token> {
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.generateUserTokens(token.userId.toString());
  }

  async generateUserTokens(userId: string): Promise<Token> {
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
    // calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { token, expiryDate } },
      { upsert: true },
    );
  }
}
