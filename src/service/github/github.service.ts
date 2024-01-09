import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import axios from 'axios';

@Injectable()
export class GithubService {
  private supabaseAdmin: SupabaseClient;
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {
    this.supabaseAdmin = createClient(
      process.env.SUPABASE_API_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  async getUserGithubAccessToken(user_id: any): Promise<string> {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('user_auth')
        .select('github_access_token')
        .eq('user_id', user_id)
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data.github_access_token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getRepos(githubAccessToken: string) {
    try {
      const data = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${githubAccessToken}`,
          Accept: 'application/json',
        },
      });

      if (data.status !== 200) {
        throw new BadRequestException(data.statusText);
      }

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
