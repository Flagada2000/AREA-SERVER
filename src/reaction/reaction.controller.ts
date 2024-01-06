import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserReactionDto, UpdateUserReactionDto } from './dto/reaction.dto';

@Controller('reaction')
export class ReactionController {
    constructor(
      private readonly reactionService: ReactionService,
      private authService: AuthService,
    ) {}

    @Get()
    async getReaction() {
        try {
            return await this.reactionService.getReaction();
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An error occurred while getting the reaction',
            );
        }
    }

    @Post('create')
    async createAction(
      @Body() createActionDto: CreateUserReactionDto,
      @Req() req: any,
    ) {
      const userResponse = await this.authService.getUser(
        req.cookies['accessToken'],
      );
      if (!userResponse.user) {
        throw new UnauthorizedException();
      }

      const action = {
        reaction_id: createActionDto.reaction_id,
        user_id: userResponse.user.id,
        reaction_config: createActionDto.reaction_config,
      };

      try {
        return await this.reactionService.create(action);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new InternalServerErrorException(
          'An error occurred while creating the action',
        );
      }
    }

    @Delete('delete')
    async deleteAction(
      @Body() deleteActionDto: CreateUserReactionDto,
      @Req() req: any,
    ) {
      const userResponse = await this.authService.getUser(
        req.cookies['accessToken'],
      );
      if (!userResponse.user) {
        throw new UnauthorizedException();
      }

      const action = {
        reaction_id: deleteActionDto.reaction_id,
        user_id: userResponse.user.id,
      };

      try {
        return await this.reactionService.delete(action.reaction_id);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new InternalServerErrorException(
          'An error occurred while deleting the action',
        );
      }
    }

    @Patch('update')
    async updateReaction(
      @Body() updateActionDto: UpdateUserReactionDto,
      @Req() req: any,
    ) {
      const userResponse = await this.authService.getUser(
        req.cookies['accessToken'],
      );
      if (!userResponse.user) {
        throw new UnauthorizedException();
      }

      const action = {
        reaction_id: updateActionDto.reaction_id,
        user_id: userResponse.user.id,
        reaction_config: updateActionDto.reaction_config,
        id: updateActionDto.id,
      };

      try {
        return await this.reactionService.update(action);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new InternalServerErrorException(
          'An error occurred while updating the action',
        );
      }
    }

}
