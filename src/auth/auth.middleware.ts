import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: 'Access token or refresh token is missing' });
    }

    try {
      // Set the session in Supabase client
      const { data, error } = await this.supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

      if (error) {
        console.error('Error setting session:', error.message || error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (data.session.access_token != accessToken) {
        res.cookie('accessToken', data.session.access_token, { httpOnly: false, maxAge: data.session.expires_at });
      }

      if (data.session.refresh_token != refreshToken) {
        res.cookie('refreshToken', data.session.refresh_token, { httpOnly: false, maxAge: data.session.expires_at });
      }

      next();
    } catch (error) {
      console.error('Error in AuthMiddleware:', error.message || error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
