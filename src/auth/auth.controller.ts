import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { User } from 'src/users/decorators/user.decorator';
import { AuthGuard } from './guards/auth.guards';
import { Token } from 'src/types/token';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() userData: CreateUserDto) {
    return this.authService.signUp(userData);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<Token> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<Token> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() userId: string,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') resetToken: string,
    @Body() { newPassword }: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(newPassword, resetToken);
  }
}
