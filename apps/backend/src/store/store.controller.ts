import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ValidationPipe,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common'
import { StoreService } from './store.service'
import { GetStoresDto } from './dto/get-stores.dto'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { AcceptInvitationDto } from './dto/accept-invitation.dto'
import { JwtAuthGuard } from '@app/auth/jwt.guard'
import type { Request } from 'express'
import { OwnerGuard } from '@app/auth/owner.guard'
import { StaffGuard } from '@app/auth/staff.guard'
import { UploadStoreImageDto } from './dto/upload-store-image.dto'

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getStores(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: GetStoresDto,
  ) {
    return this.storeService.getStores(query)
  }

  @Get(':id')
  async getStore(@Param('id', ParseIntPipe) id: number) {
    return this.storeService.getStore(id)
  }

  @Post()
  @UseGuards(OwnerGuard)
  async createStore(
    @Req() req: Request,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.createStore(req.user.id, createStoreDto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateStore(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.updateStore(req.user.id, id, updateStoreDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeStore(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.storeService.removeStore(req.user.id, id)
  }

  @Post(':id/staff/invitation')
  @UseGuards(JwtAuthGuard)
  async createStaffInvitation(
    @Req() req: Request,
    @Param('id', ParseIntPipe) storeId: number,
  ) {
    return this.storeService.createStaffInvitation(req.user.id, storeId)
  }

  @Post('staff/invitation/accept')
  @UseGuards(JwtAuthGuard)
  async acceptStaffInvitation(
    @Req() req: Request,
    @Body() acceptInvitationDto: AcceptInvitationDto,
  ) {
    return this.storeService.acceptStaffInvitation(
      req.user.id,
      acceptInvitationDto.code,
    )
  }

  @Delete(':id/staff/:userId')
  @UseGuards(JwtAuthGuard)
  async removeStaff(
    @Req() req: Request,
    @Param('id', ParseIntPipe) storeId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.storeService.removeStaff(req.user.id, storeId, userId)
  }

  @Post(':id/image/presign')
  @UseGuards(StaffGuard)
  async createImagePresign(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() uploadStoreImageDto: UploadStoreImageDto,
  ) {
    return this.storeService.createStoreImagePresign(
      req.user.id,
      id,
      uploadStoreImageDto,
    )
  }
}
