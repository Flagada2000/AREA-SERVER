import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ActionController } from './action/action.controller';
import { ActionService } from './action/action.service';
import { ActionModule } from './action/action.module';
import { ServiceModule } from './service/service.module';
import { ServiceController } from './service/service.controller';
import { ServiceService } from './service/service.service';
import { ReactionController } from './reaction/reaction.controller';
import { ReactionService } from './reaction/reaction.service';
import { ReactionModule } from './reaction/reaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './scheduling/scheduling.service';
import { GithubModule } from './service/github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    SupabaseModule,
    ActionModule,
    ServiceModule,
    ReactionModule,
    GithubModule,
  ],
  controllers: [AppController, ActionController, ServiceController, ReactionController],
  providers: [AppService, ActionService, ServiceService, ReactionService, TasksService],
})
export class AppModule {}
