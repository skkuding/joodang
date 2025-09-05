import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Patch,
  UseGuards,
  Query,
  ParseBoolPipe,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { CreateReservationDto } from './dto/create-reservation.dto'
import type { Request } from 'express'
import { JwtAuthGuard } from '@app/auth/jwt.guard'

@UseGuards(JwtAuthGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: Request,
  ) {
    return this.reservationService.createReservation(
      createReservationDto,
      req.user.id,
    )
  }

  @Post('/call/:id')
  callReservation(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.reservationService.callReservation(id, req.user.id)
  }

  @Get()
  getReservations(@Req() req: Request) {
    return this.reservationService.getReservations(req.user.id)
  }

  @Get('/store/:storeId')
  getStoreReservations(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Req() req: Request,
  ) {
    return this.reservationService.getStoreReservations(storeId, req.user.id)
  }

  @Get(':id')
  getReservation(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.reservationService.getReservation(id, req.user.id)
  }

  @Delete(':id')
  removeReservation(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.reservationService.removeReservation(id, req.user.id)
  }

  @Patch(':id/confirm')
  confirmReservation(
    @Param('id', ParseIntPipe) id: number,
    @Query('isConfirm', ParseBoolPipe) isConfirm: boolean,
    @Req() req: Request,
  ) {
    return this.reservationService.confirmReservation(
      id,
      req.user.id,
      isConfirm,
    )
  }
}
