import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ServiceService],
  controllers: [ServiceController],

})
export class ServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // Apply your AuthMiddleware
      .forRoutes(
        { path: 'service/', method: RequestMethod.GET }
      );
  }
}
