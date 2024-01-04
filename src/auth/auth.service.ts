import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { generate } from 'generate-password'

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

  async signInWithGithub() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    if (error) {
      throw new Error(error.message);
    }

    return await this.supabase.auth.getSession();
  }

  // async signInOrSignUpWithGithub(email: string, access_token: string) {
  //   const { data, error } = await this.supabase.auth.signUp({
  //     email: email,
  //     password: generate({ length: 12, numbers: true }),
  //   });


  //   if (error.status === '409') {
  //     const { data, error } = await this.supabase.auth.signIn({
  //       email: email,
  //       provider: 'github',
  //       access_token: access_token,
  //     });

  //     if (error) {
  //       throw new Error(error.message);
  //     }

  //     return data;

  //   }

  //   return data;
  // }
}
