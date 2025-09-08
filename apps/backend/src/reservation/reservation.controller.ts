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
import {
  CreateReservationDto,
  CreateWalkInReservationDto,
} from './dto/create-reservation.dto'
import type { Request } from 'express'
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard'
import { OptionalJwtAuthGuard } from '@app/auth/guards/optional-jwt.guard'
import { Public } from '@app/auth/public.decorator'
import { TokensDto } from './dto/token.dto'

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

  @Get(':id')
  getReservation(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.reservationService.getReservation(id, req.user.id)
  }

  @Get('token')
  @Public()
  getReservationWithTokens(@Query('reservationTokens') token: string[]) {
    return this.reservationService.getReservationWithTokens(token)
  }

  @Get('/store/:storeId')
  getStoreReservations(
    @Req() req: Request,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query('isConfirmed', new ParseBoolPipe({ optional: true }))
    isConfirmed?: boolean,
    @Query('toBeConfirmed', new ParseBoolPipe({ optional: true }))
    toBeConfirmed?: boolean,
    @Query('isWalkIn', new ParseBoolPipe({ optional: true }))
    isWalkIn?: boolean,
  ) {
    return this.reservationService.getStoreReservations({
      storeId,
      userId: req.user.id,
      isConfirmed,
      toBeConfirmed,
      isWalkIn,
    })
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

  @Patch('token')
  addMyReservationWithToken(@Body() tokensDto: TokensDto, @Req() req: Request) {
    return this.reservationService.addMyReservationWithToken(
      tokensDto,
      req.user.id,
    )
  }

  @Post('/walkin')
  @UseGuards(OptionalJwtAuthGuard)
  walkinReservation(
    @Body() createWalkInReservationDto: CreateWalkInReservationDto,
    @Req() req: Request,
  ) {
    return this.reservationService.createWalkInReservation(
      createWalkInReservationDto,
      req.user?.id,
    )
  }
}
