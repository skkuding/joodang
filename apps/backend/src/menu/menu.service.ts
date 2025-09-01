import { Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: createMenuDto,
    })
  }

  async getMenus(storeId: number) {
    const menus = await this.prisma.menu.findMany({
      where: {
        storeId,
      },
    })

    const groupedMenus = menus.reduce((acc, menu) => {
      if (!acc[menu.category]) {
        acc[menu.category] = []
      }
      acc[menu.category].push(menu)
      return acc
    }, {})

    return groupedMenus
  }

  async getMenu(id: number) {
    return this.prisma.menu.findUnique({
      where: {
        id,
      },
    })
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
    return this.prisma.menu.update({
      where: {
        id,
      },
      data: updateMenuDto,
    })
  }

  async removeMenu(id: number) {
    return this.prisma.menu.delete({
      where: {
        id,
      },
    })
  }
}
