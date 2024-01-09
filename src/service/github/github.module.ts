import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [GithubService, AuthService],
  controllers: [GithubController]
})
export class GithubModule {}
