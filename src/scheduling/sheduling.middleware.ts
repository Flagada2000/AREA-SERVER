import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  private supabaseAdmin: SupabaseClient;

  constructor() {
    // Initialisez Supabase avec la clé de service
    this.supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // Attachez le client Supabase avec les droits d'administration à la requête
    req['supabaseAdmin'] = this.supabaseAdmin;
    next();
  }
}
