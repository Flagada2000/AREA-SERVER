import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';

@Injectable()
export class GithubMiddleware implements NestMiddleware {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken || !refreshToken) {
      return res
        .status(401)
        .json({ message: 'Access token or refresh token is missing' });
    }

    try {
      const { status } = await axios.get('https://api.github.com/user/issues', {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/json',
        },
      });

      if (status === 401) {
        return res
          .status(401)
          .json({ message: 'Please login to your github account' });
      }

      next();
    } catch (error) {
      console.error('Error in GithubMiddleware:', error.message || error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
