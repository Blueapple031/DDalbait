import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';
import { Match } from './entities/match.entity';
import { MatchLog } from './entities/match-log.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Match, MatchLog, User]),
  ],
  providers: [MatchService, MatchResolver],
  exports: [MatchService],
})
export class MatchModule {} 