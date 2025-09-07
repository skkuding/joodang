import { Module } from '@nestjs/common';
import { FestivalController } from './festival.controller';
import { FestivalService } from './festival.service';

@Module({
  controllers: [FestivalController],
  providers: [FestivalService]
})
export class FestivalModule {}
