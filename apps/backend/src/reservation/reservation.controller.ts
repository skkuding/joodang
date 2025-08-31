import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { CreateReservationDto } from './dto/create-reservation.dto'

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto)
  }

  @Post('/call/:id')
  callReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.callReservation(id)
  }

  @Get()
  getReservations() {
    return this.reservationService.getReservations(1)
  }

  @Get('/store/:storeId')
  getStoreReservations(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.reservationService.getStoreReservations(storeId)
  }

  @Get(':id')
  getReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.getReservation(id)
  }

  @Delete(':id')
  removeReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.removeReservation(id)
  }
}
