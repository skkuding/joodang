import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { StaffGuard } from '@app/auth/guards/staff.guard'
import { Public } from '@app/auth/public.decorator'
import { UploadMenuImageDto } from './dto/upload-menu-image.dto'
import type { Request } from 'express'

@UseGuards(StaffGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  createMenu(@Req() req: Request, @Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto, req.user.id)
  }

  @Get()
  @Public()
  getMenus(@Query('storeId', ParseIntPipe) storeId: number) {
    return this.menuService.getMenus(storeId)
  }

  @Get(':id')
  @Public()
  getMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.getMenu(id)
  }

  @Patch(':id')
  updateMenu(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.updateMenu(id, updateMenuDto, req.user.id)
  }

  @Delete(':id')
  removeMenu(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeMenu(id, req.user.id)
  }

  @Post('/image/presign')
  async createImagePresign(
    @Req() req: Request,
    @Body() uploadMenuImageDto: UploadMenuImageDto,
  ) {
    return this.menuService.createMenuImagePresign(
      req.user.id,
      uploadMenuImageDto,
    )
  }
}
