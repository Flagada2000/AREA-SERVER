import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async signInWithPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
    });


    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getUser(accessToken: string | undefined) {

    if (!accessToken) {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }
      console.log(data);
      return data;
    } else {
      const { data, error } = await this.supabase.auth.getUser(accessToken);
      if (error) {
        throw new Error(error.message);
      }
      console.log(data);
      return data;
    }
  }
}
