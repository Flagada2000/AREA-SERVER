import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['accessToken']; // Replace with your cookie name

    console.log(token);
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const response = await axios.get(
        `${process.env.SUPABASE_API_URL}/auth/v1/user`,
        {
          headers: { Authorization: `Bearer ${token}`, apikey: `${process.env.SUPABASE_ANON_KEY}` },
        },
      );

      if (response.status === 200) {
        console.log(response.data);
        next();
      } else {
        console.log(response.data);
        res.status(401).send('Unauthorized');
      }
    } catch (error) {
      console.log(error);
      res.status(401).send('Unauthorized');
    }
  }
}
