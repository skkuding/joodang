import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('')
  async getStores() {
    return this.storeService.getStores();
  }

  @Get(':id')
  async getStore(@Param('id') id: number) {
    return this.storeService.getStore(id)
  }
  
  @Post()
  async createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.createStore(createStoreDto)
  }

  @Patch(':id')
  async updateStore(@Param('id') id: number, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.updateStore(id, updateStoreDto)
  }

  @Delete(':id')
  async removeStore(@Param('id') id: number) {
    return this.storeService.removeStore(id)
  }
}
