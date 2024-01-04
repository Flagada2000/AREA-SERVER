import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/auth/callback',
      scope: ['public_profile', 'repo', 'user'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    // Sauvegarde accessToken quelque part ou le passe directement à l'utilisateur
    const user = { profile, accessToken }; // Inclut accessToken dans l'objet utilisateur
    return user;
  }
}

// @Injectable()
// export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
//   constructor(configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET'),
//     });
//   }

//   async validate(payload: any) {
//     return { id: payload.sub, username: payload.username };
//   }
// }