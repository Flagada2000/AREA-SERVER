import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ServiceService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getService() {
    const { data, error } = await this.supabase.from('services').select('*');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('id', id).single();
    return data;
  }
}
