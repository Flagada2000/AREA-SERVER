import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy as GitStrategy } from 'passport-github';
import { Strategy as OutlookLiveStrategy } from 'passport-outlook';

@Injectable()
export class GithubStrategy extends PassportStrategy(GitStrategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/auth/callback',
      scope: ['public_profile', 'repo', 'user'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    // Save accessToken somewhere or pass it directly to the user
    const user = { profile, accessToken }; // Include accessToken in the user object
    return user;
  }
}

@Injectable()
export class OutlookStrategy extends PassportStrategy(OutlookLiveStrategy, 'windowslive') {
  constructor() {
    super({
      clientID: process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/outlook/callback',
      scope: ['openid', 'profile', 'offline_access', 'https://outlook.office.com/Mail.Read']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const user = {
      outlookId: profile.id,
      name: profile.DisplayName,
      email: profile.EmailAddress,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    return done(null, user);
  }
}

