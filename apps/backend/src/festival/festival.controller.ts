import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common'
import { FestivalService } from './festival.service'

@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @Get('')
  async getFestivals(
    @Query('cursor') cursor: number | null,
    @Query('take', new DefaultValuePipe(8))
    take: number,
  ) {
    return this.festivalService.getFestivals(cursor, take)
  }
}
