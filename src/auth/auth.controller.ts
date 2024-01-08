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
import dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

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
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Post('signup')
  async signUp(@Body() loginDto: LoginDto, @Req() request: Request) {
    const validationErrors = await validate(loginDto);
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    try {
      const data = await this.authService.signUp(loginDto.email, loginDto.password);
      request.res.cookie('accessToken', data.session.access_token, { httpOnly: false, maxAge: data.session.expires_at });
      request.res.cookie('refreshToken', data.session.refresh_token, { httpOnly: false, maxAge: data.session.expires_at });
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred during sign up');
    }
  }

  @Get('profile')
  async getProfile(@Req() request: Request) {
    const accessToken = request.cookies['accessToken'];

    if (accessToken) {
      return await this.authService.getUserProfile(accessToken);
    } else {
      return { message: 'No access token found' };
    }
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


  @Get('github')
  async login(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['accessToken'];

    if (accessToken) {
      const data =  await this.authService.getUser(accessToken);

      const supabaseUserId = data.user.id;

      const tempToken = await this.authService.setTempToken(supabaseUserId);


      const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&state=${tempToken}`;


      res.redirect(githubAuthUrl);
    } else {
      res.status(401).json({ message: 'No access token found' });
    }
  }

  @Get('callback')
  async authCallback(@Req() req: any, @Res() res: Response) {
    const tempToken = req.query.state;
    const code: string = req.query.code;

    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');
    console.log('code :', code);

    try {
      const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }, {
        headers: { 'Accept': 'application/json' }
      });

      console.log(tokenResponse.data);

      const githubAccessToken = tokenResponse.data.access_token;
      const githubRefreshToken = tokenResponse.data.refresh_token;

      const supabaseUserId = await this.authService.getSupabaseUserIdFromTempToken(tempToken);
      await this.authService.storeGithubAccessToken(supabaseUserId, githubAccessToken, githubRefreshToken);

      // Suite de votre logique...
    } catch (error) {
      console.error('Erreur lors de l\'échange du code GitHub :', error);
      // Gérez l'erreur ici
    }

    // Redirige vers le front-end
    res.redirect(`http://localhost:3000/profile`);
  }
}
