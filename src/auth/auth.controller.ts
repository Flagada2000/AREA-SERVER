import { Controller, Post, Body, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import { get } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signin')
  async signIn(@Req() request: Request) {
    const { email, password } = request.query;
    const loginDto: LoginDto = { email: email as string, password: password as string };

    const validationErrors = await validate(loginDto);
    if (validationErrors.length > 0) {
      return { error: validationErrors };
    }

    console.log(email, password);
    return this.authService.signInWithPassword(email as string, password as string);
  }

  @Post('signup')
  async signUp(@Body() loginDto: LoginDto) {
    return this.authService.signUp(
      loginDto.email,
      loginDto.password
    );
  }

  @Get('me')
  async me(@Req() request: Request, @Res() response: Response) {
    const accessToken = request.cookies['accessToken'];

    if (accessToken) {
      return response.status(200).json(await this.authService.getUser(accessToken));
    } else {
      return response.status(401).json({ message: 'No access token found' });
    }
  }

  @Get('test-token')
  async testToken(@Req() request: Request, @Res() response: Response) {
      const accessToken = request.cookies['accessToken'];

      if (accessToken) {
          return response.status(200).json({ message: 'Access token is present', token: accessToken });
      } else {
          return response.status(401).json({ message: 'No access token found' });
      }
  }
}
