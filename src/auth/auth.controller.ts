import { Controller, Post, Body, Get, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { validate } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import axios from 'axios';

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

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async login() {
    //
  }

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const githubAccessToken = user.accessToken; // Récupère le token d'accès GitHub

    console.log(user);
    res.cookie('githubAccessToken', githubAccessToken, { httpOnly: false });

    axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${githubAccessToken}` }
    }).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.error(error);
    });
    // Redirige vers le front-end
    res.redirect(`http://localhost:3000/profile`);
  }
}
