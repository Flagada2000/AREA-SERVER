import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { GithubStrategy } from './auth.strategy';
import { AuthMiddleware } from './auth.middleware'; // Import your AuthMiddleware

@Module({
  exports: [AuthService],
  imports: [SupabaseModule],
  providers: [AuthService, GithubStrategy],
  controllers: [AuthController],
})

export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // Apply your AuthMiddleware
      .forRoutes(
        { path: 'auth/me', method: RequestMethod.GET } // Specify the route to protect
      );
  }
}

