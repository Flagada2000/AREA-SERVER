import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserActionDto, UpdateUserActionDto } from './dto/action.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ActionService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async create(createActionDto: CreateUserActionDto) {
    const { data, error } = await this.supabase
      .from('user_actions')
      .insert(createActionDto)
      .select();

    if (error) {
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    console.log(data);
    return data;
  }

  async update(updateActionDto: UpdateUserActionDto) {
    const { data, error } = await this.supabase
      .from('user_actions')
      .update(updateActionDto)
      .eq('id', updateActionDto.id)
      .select();

    if (error) {
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    console.log(data);
    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.supabase
      .from('user_actions')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(error);
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    console.log(data);
    return data;
  }

  async findAllByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', userId);

    console.log(userId);
    console.log(data);
    if (error) {
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    return data;
  }


  async findAll() {
    const { data, error } = await this.supabase.from('actions').select('*');
    console.log(data);
    return data;
  }
}
