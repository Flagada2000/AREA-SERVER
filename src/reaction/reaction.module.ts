import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ReactionController],
    providers: [ReactionService],
  })
export class ReactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'reaction/create', method: RequestMethod.POST },
        { path: 'reaction/', method: RequestMethod.GET},
        { path: 'reaction/delete', method: RequestMethod.DELETE},
        { path: 'reaction/update', method: RequestMethod.PATCH});
  }
}

