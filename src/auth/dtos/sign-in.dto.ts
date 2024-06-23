import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password should be at least six(6) characters' })
  password: string;
}
