import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { get } from 'http';
import { ActionDto, UserActionDto } from 'src/action/dto/action.dto';
import { ServicePool } from './scheduling.service.pool';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly servicePool: ServicePool;
  private supabaseAdmin: SupabaseClient;

  constructor() {
    this.supabaseAdmin = createClient(
      process.env.SUPABASE_API_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    this.servicePool = new ServicePool(this.supabaseAdmin);
  }

  async getActiveUserActions(): Promise<UserActionDto[] | []> {
    const { data, error } = await this.supabaseAdmin
      .from('user_actions')
      .select('*')
      .eq('status', 'active');

    if (error) {
      this.logger.error(error.message);
      return [];
    }

    const userActions: UserActionDto[] = data.map((item: any) => new UserActionDto(item));

    return userActions;
  }

  async getActionById(actionId: number): Promise<ActionDto | null> {
    const { data, error } = await this.supabaseAdmin
      .from('actions')
      .select('*')
      .eq('id', actionId)
      .single();

    if (error) {
      this.logger.error(error.message);
      return null;
    }

    return new ActionDto(data);
  }

  async actionCasting(userAction: UserActionDto): Promise<any> {
    const action: ActionDto = await this.getActionById(userAction.action_id);

    return this.servicePool.handleService(action.service_id, userAction);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    console.log('Cron is running');
    const userActions: UserActionDto[] = await this.getActiveUserActions();

    if (userActions.length === 0) {
      return;
    }

    userActions.forEach((userAction: UserActionDto) => {
      this.actionCasting(userAction);
    });
  }
}
