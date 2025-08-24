import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  getMenus(@Query('storeId', ParseIntPipe) storeId: number) {
    return this.menuService.getMenus(storeId);
  }

  @Get(':id')
  getMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.getMenu(id);
  }

  @Patch(':id')
  updateMenu(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete(':id')
  removeMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeMenu(id);
  }
}
