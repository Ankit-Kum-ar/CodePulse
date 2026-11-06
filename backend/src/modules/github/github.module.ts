import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { CustomThrottlerGuard } from '../../common/guards/custom-throttler.guard';

@Module({
  imports: [ConfigModule],
  controllers: [GithubController],
  providers: [GithubService, CustomThrottlerGuard],
  exports: [GithubService],
})
export class GithubModule {}
