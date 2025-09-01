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
} from '@nestjs/common'
import { StoreService } from './store.service'
import { GetStoresDto } from './dto/get-stores.dto'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { AddStaffDto } from './dto/add-staff.dto'
import { JwtAuthGuard } from '@app/auth/jwt.guard'
import type { Request } from 'express'

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
  async getStore(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.storeService.getStore(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.storeService.removeStore(req.user.id, id)
  }

  @Post(':id/staff')
  @UseGuards(JwtAuthGuard)
  async addStaff(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() addStaffDto: AddStaffDto,
  ) {
    return this.storeService.addStaff(req.user.id, id, addStaffDto);
  }
}
