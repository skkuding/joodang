import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { StoreService } from './store.service';
import { GetStoresDto } from './dto/get-stores.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getStores(@Query() getStoresDto: GetStoresDto) {
    const { filter } = getStoresDto;
    return this.storeService.getStores(filter);
  }

  @Get(':id')
  async getStore(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.storeService.getStore(id)
  }
  
  @Post()
  async createStore(
    @Body() createStoreDto: CreateStoreDto
  ) {
    return this.storeService.createStore(createStoreDto)
  }

  @Patch(':id')
  async updateStore(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateStoreDto: UpdateStoreDto
  ) {
    return this.storeService.updateStore(id, updateStoreDto)
  }

  @Delete(':id')
  async removeStore(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.storeService.removeStore(id)
  }
}
