import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['accessToken']; // Your cookie name

    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
      const decodedToken = jwt.decode(token) as jwt.JwtPayload;
      const isExpired = decodedToken && Date.now() >= decodedToken.exp * 1000;

      if (isExpired) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
          return res.status(401).json({ message: 'Refresh token not found' });
        }

        const newTokenResponse = await axios.post(`${process.env.SUPABASE_API_URL}/auth/v1/token`, {
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        });

        const newAccessToken = newTokenResponse.data.access_token;
        if (newAccessToken) {
          res.cookie('accessToken', newAccessToken, { httpOnly: true });
          req.cookies['accessToken'] = newAccessToken;
          next();
        } else {
          return res.status(401).json({ message: 'Unable to refresh access token' });
        }
      } else {
        next();
      }
    } catch (error) {
      console.error('Error in AuthMiddleware:', error.message || error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
