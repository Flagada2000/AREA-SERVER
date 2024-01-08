import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private authService: AuthService,
  ) {}

  @Get()
  async getService() {
    return await this.serviceService.getService();
  }

  @Get('/:id')
  async getServiceById(@Req() req: any) {
    try {
      return await this.serviceService.findOne(req.params.id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving action',
      );
    }
  }
}
