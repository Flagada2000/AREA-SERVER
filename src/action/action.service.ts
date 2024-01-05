import { Inject, Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ActionService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async create(createActionDto: CreateActionDto) {
    const { data, error } = await this.supabase
      .from('actions')
      .insert(createActionDto);

    if (error) {
      throw new Error(error.message);
    }

    return 'Action created';
  }

  async findAll() {
    const { data, error } = await this.supabase.from('actions').select('*');
    console.log(data);
    return data;
  }
}
