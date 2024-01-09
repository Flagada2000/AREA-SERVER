import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private supabaseAdmin: SupabaseClient;

  constructor() {
    // Initialisez Supabase avec la clé de service
    this.supabaseAdmin = createClient(
      process.env.SUPABASE_API_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    // this.logger.debug('Called every 10 seconds');
  }
}
