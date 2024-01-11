import { SupabaseClient } from '@supabase/supabase-js';
import { UserActionDto } from 'src/action/dto/action.dto';
import axios from 'axios';

export class OutlookPool {
  private supabaseAdmin: SupabaseClient;

  async newEmailFrom(userAction: UserActionDto) {
    const config: JSON = JSON.parse(userAction.action_config);
    const fromEmail: string = config['from_email'];

    if (!fromEmail) {
      throw new Error('From email not found');
    }

    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .select('outlook_access_token')
      .eq('user_id', userAction.user_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const outlookAccessToken: string = data['outlook_access_token'];

    if (!outlookAccessToken) {
      console.log('No outlook access token found for user :', userAction.user_id);
    }

    const outlookEmail = await axios.get(
      `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=from/emailAddress/address eq '${fromEmail}' and receivedDateTime ge 2024-01-11T22:00:01Z`,
      {
        headers: {
          Authorization: `Bearer ${outlookAccessToken}`,
        },
      },
    );

    outlookEmail.data.value.forEach(element => {
      console.log(element.subject);
      console.log(element.bodyPreview);
    });

  }

  private actionMap = {
    6: (userAction: UserActionDto) => this.newEmailFrom(userAction)
  };

  public handleAction(userAction: UserActionDto) {
    const action = this.actionMap[userAction.action_id];

    console.log(userAction);
    if (action) {
      action(userAction);
    } else {
      throw new Error('Action not found');
    }
  }

  constructor(supabaseAdmin: SupabaseClient) {
    this.supabaseAdmin = supabaseAdmin;
  }
}

export default OutlookPool;
