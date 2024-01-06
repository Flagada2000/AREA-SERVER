import { Controller, Get } from '@nestjs/common';
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
}
