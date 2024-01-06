import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserReactionDto, UpdateUserReactionDto } from './dto/reaction.dto';

@Injectable()
export class ReactionService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getReaction() {
    const { data, error } = await this.supabase.from('reactions').select('*');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async create(createActionDto: CreateUserReactionDto) {
    const { data, error, status } = await this.supabase
      .from('user_reactions')
      .insert(createActionDto)
      .select();

    if (error) {
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    console.log(data);
    return data;
  }

  async delete(id: number) {
    const { data, error, status } = await this.supabase
      .from('user_reactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(error);
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    if (status === 204) return { message: 'Delete successful', status }; // Handling 204 response
    console.log(data);
    return data;
  }

  async update(updateReactionDto: UpdateUserReactionDto) {
    const { data, error } = await this.supabase
      .from('user_reactions')
      .update(updateReactionDto)
      .eq('id', updateReactionDto.id)
      .select();

    if (error) {
      throw new BadRequestException(error.message); // Replace with the appropriate exception
    }
    console.log(data);
    return data;
  }
}
