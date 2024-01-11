import { UserActionDto } from 'src/action/dto/action.dto';
import GithubPool from './github/github.pool';
import { SupabaseClient } from '@supabase/supabase-js';
import OutlookPool from './outlook/outlook.pool';

export class ServicePool {
  private githubPool: GithubPool;
  private outlookPool: OutlookPool;

  private serviceMap: { [key: number]: any };

  constructor(supabaseAdmin: SupabaseClient) {
    this.githubPool = new GithubPool(supabaseAdmin);
    this.outlookPool = new OutlookPool(supabaseAdmin);
    this.serviceMap = {
      1: this.githubPool,
      3: this.outlookPool
    };
  }

  public handleService(serviceId: number, userAction: UserActionDto) {
    const service = this.serviceMap[serviceId];
    if (service) {
      service.handleAction(userAction);
    } else {
      console.log('Service non pris en charge :', serviceId);
    }
  }
}
