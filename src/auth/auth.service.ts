import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Token } from 'src/types/token';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { UsersRepository } from 'src/users/users.repository';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
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
    const tokens = await this.generateUserTokens(user);
    return tokens;
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
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('jwt.refreshToken'),
      });
      const user = await this.usersRepo.findById(payload.userId);
      if (
        !user ||
        !user.refreshToken ||
        !(await this.hashingService.compare(refreshToken, user.refreshToken))
      ) {
        throw new ForbiddenException('Access Denied');
      }
      return this.generateUserTokens(user);
    } catch (error) {
      console.log(error);
    }
  }

  async generateUserTokens(user: UserDocument): Promise<Token> {
    const jwtPayload = { userId: user._id.toString() };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(jwtPayload, {
        expiresIn: '1h',
        secret: this.config.get('jwt.accessToken'),
      }),
      this.jwtService.sign(jwtPayload, {
        expiresIn: '7d',
        secret: this.config.get('jwt.refreshToken'),
      }),
    ]);

    user.refreshToken = await this.hashingService.hash(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
  }
}
