import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
  Patch,
  Delete,
} from '@nestjs/common';
import { ActionService } from './action.service';
import {
  CreateUserActionDto,
  UpdateUserActionDto,
} from './dto/action.dto';
import { AuthService } from '../auth/auth.service';

@Controller('action')
export class ActionController {
  constructor(
    private readonly actionService: ActionService,
    private authService: AuthService,
  ) {}

  @Post('create')
  async createAction(
    @Body() createActionDto: CreateUserActionDto,
    @Req() req: any,
  ) {
    const userResponse = await this.authService.getUser(
      req.cookies['accessToken'],
    );
    if (!userResponse.user) {
      throw new UnauthorizedException();
    }

    const action = {
      action_id: createActionDto.action_id,
      user_id: userResponse.user.id,
      action_config: createActionDto.action_config,
    };

    try {
      return await this.actionService.create(action);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the action',
      );
    }
  }

  @Patch('update')
  async updateAction(
    @Body() updateActionDto: UpdateUserActionDto,
    @Req() req: any,
  ) {
    const userResponse = await this.authService.getUser(
      req.cookies['accessToken'],
    );
    if (!userResponse.user) {
      throw new UnauthorizedException();
    }

    const action = {
      action_id: updateActionDto.action_id,
      user_id: userResponse.user.id,
      action_config: updateActionDto.action_config,
      id: updateActionDto.id,
    };

    try {
      return await this.actionService.update(action);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating the action',
      );
    }
  }

  @Delete('delete')
  async deleteAction(@Body('id') id: number, @Req() req: any) {
    const userResponse = await this.authService.getUser(
      req.cookies['accessToken'],
    );
    if (!userResponse.user) {
      throw new UnauthorizedException();
    }

    try {
      return await this.actionService.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.log(error);
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the action',
      );
    }
  }

  @Get('user')
  async findAllForUser(@Req() req: any) {
    const userResponse = await this.authService.getUser(
      req.cookies['accessToken'],
    );
    if (!userResponse.user) {
      throw new UnauthorizedException();
    }

    try {
      return await this.actionService.findAllByUserId(userResponse.user.id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving user actions',
      );
    }
  }

  @Get()
  async findAllActions() {
    try {
      return await this.actionService.findAll();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving actions',
      );
    }
  }
}
