import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  SupabaseClient,
  User,
  UserResponse,
  createClient,
} from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private supabaseAdmin: SupabaseClient;
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {
    this.supabaseAdmin = createClient(
      process.env.SUPABASE_API_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    console.log(data);
    return data;
  }

  async getUserProfile(acessToken: string) {
    let dataa = await this.supabase.auth.getUser(acessToken);

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', dataa.data.user.id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async getUser(accessToken: string | undefined) {
    try {
      const { data, error } = await this.supabase.auth.getUser(accessToken);
      if (error) {
        throw new BadRequestException(error.message);
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signInWithGithub() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
      });

      if (error) {
        throw new BadRequestException(error.message);
      }
      console.log(data);
      const { data: profile, error: profileError } =
        await this.supabase.auth.getSession();

      if (profileError) {
        throw new BadRequestException(profileError.message);
      }

      console.log(profile);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setTempToken(supabaseUserId: string): Promise<string> {
    console.log(supabaseUserId);
    const tempToken = randomBytes(16).toString('hex');
    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .update({ tmp_token: tempToken })
      .eq('user_id', supabaseUserId);

    if (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }

    return tempToken;
  }

  async getSupabaseUserIdFromTempToken(tempToken: string) {
    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .select('user_id')
      .eq('tmp_token', tempToken)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async storeGithubAccessToken(user_id: any, githubAccessToken: string, githubRefreshToken: string) {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('user_auth')
        .update({ github_access_token: githubAccessToken })
        .eq('user_id', user_id.user_id);

      console.log("Error :", error);
      if (error) {
        throw new BadRequestException(error.message);
      }

      await this.supabaseAdmin
        .from('user_auth')
        .update({ tmp_token: null })
        .eq('user_id', user_id.user_id);

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async storeOutlookAccessToken(user_id: any, outlookAccessToken: string, outlookRefreshToken: string) {
    try {
      console.log("user_id :", user_id)
      const { data, error } = await this.supabaseAdmin
        .from('user_auth')
        .update({ outlook_access_token: outlookAccessToken, outlook_refresh_token: outlookRefreshToken })
        .eq('user_id', user_id.user_id);

      console.log("Error :", error);
      if (error) {
        throw new BadRequestException(error.message);
      }

      await this.supabaseAdmin
        .from('user_auth')
        .update({ tmp_token: null })
        .eq('user_id', user_id.user_id)
        .single();

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
