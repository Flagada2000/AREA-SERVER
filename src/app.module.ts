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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SupabaseModule,
    ActionModule,
    ServiceModule,
  ],
  controllers: [AppController, ActionController, ServiceController],
  providers: [AppService, ActionService, ServiceService],
})
export class AppModule {}
