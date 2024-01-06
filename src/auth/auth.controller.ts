import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signin')
  async signIn(@Req() request: Request) {
    const { email, password } = request.query;
    const loginDto: LoginDto = { email: email as string, password: password as string };

    const validationErrors = await validate(loginDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    try {
      const data = await this.authService.signInWithPassword(email as string, password as string);
      request.res.cookie('accessToken', data.session.access_token, { httpOnly: false, maxAge: data.session.expires_at });
      request.res.cookie('refreshToken', data.session.refresh_token, { httpOnly: false, maxAge: data.session.expires_at });
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Rethrow the error to send the correct status code and message
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Post('signup')
  async signUp(@Body() loginDto: LoginDto, @Res() response: Response) {
    const validationErrors = await validate(loginDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    try {
      const data = await this.authService.signUp(loginDto.email, loginDto.password);
      response.cookie('accessToken', data.session.access_token, { httpOnly: false, maxAge: data.session.expires_at });
      response.cookie('refreshToken', data.session.refresh_token, { httpOnly: false, maxAge: data.session.expires_at });
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Rethrow the error to send the correct status code and message
      }
      throw new InternalServerErrorException('An unexpected error occurred during sign up');
    }
  }

  @Get('me')
  async me(@Req() request: Request, @Res() response: Response) {
    try {
      const accessToken = request.cookies['accessToken'];

      if (!accessToken) {
        throw new UnauthorizedException('No access token found');
      }

      const data = await this.authService.getUser(accessToken);
      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Rethrow for correct status code and message
      }
      throw new InternalServerErrorException('An unexpected error occurred while fetching user data');
    }
  }


  @Get('github')
  @UseGuards(AuthGuard('github'))
  async login() {
    //
  }

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const githubAccessToken = user.accessToken; // Récupère le token d'accès GitHub

    console.log(user);
    res.cookie('githubAccessToken', githubAccessToken, { httpOnly: false });

    axios
      .get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${githubAccessToken}` },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    // Redirige vers le front-end
    res.redirect(`http://localhost:3000/profile`);
  }
}
