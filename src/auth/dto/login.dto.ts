import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
