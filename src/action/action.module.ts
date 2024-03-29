import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ActionController],
    providers: [ActionService],
  })
export class ActionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'action/create', method: RequestMethod.POST },
                 { path: 'action/update', method: RequestMethod.PATCH },
                 { path: 'action/delete', method: RequestMethod.DELETE },
                 { path: 'action/', method: RequestMethod.GET },
                 { path: 'action/user', method: RequestMethod.GET });
  }
}
