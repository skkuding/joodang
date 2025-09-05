import { ForbiddenException, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { PrismaService } from 'prisma/prisma.service'
import { S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { UploadMenuImageDto } from './dto/upload-menu-image.dto'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

@Injectable()
export class MenuService {
  private s3: S3Client
  private bucket: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get<string>('S3_BUCKET')!
    this.s3 = new S3Client({
      endpoint: this.config.get<string>('S3_ENDPOINT'),
      region: this.config.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!,
      },
      forcePathStyle: this.config.get<string>('S3_FORCE_PATH_STYLE') === 'true',
    })
  }

  async createMenu(createMenuDto: CreateMenuDto, userId: number) {
    // 권한 확인: 해당 가게의 스태프인지 확인
    const staff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: createMenuDto.storeId } },
      select: { id: true },
    })
    if (!staff) {
      throw new ForbiddenException('가게에 대한 수정 권한이 없습니다.')
    }
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

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto, userId: number) {
    // 메뉴가 속한 가게 확인 후 스태프 권한 체크
    const target = await this.prisma.menu.findUnique({
      where: { id },
      select: { storeId: true },
    })
    if (!target) {
      // prisma가 업데이트 시 not found를 던지긴 하지만, 권한 체크 일관성 위해 미리 체크
      throw new ForbiddenException('수정할 메뉴를 찾을 수 없습니다.')
    }
    const staff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: target.storeId } },
      select: { id: true },
    })
    if (!staff) {
      throw new ForbiddenException('가게에 대한 수정 권한이 없습니다.')
    }
    // storeId 변경은 허용하지 않음
    const { storeId: _omitStoreId, ...data } = updateMenuDto as any
    return this.prisma.menu.update({
      where: { id },
      data,
    })
  }

  async removeMenu(id: number, userId: number) {
    // 메뉴가 속한 가게 확인 후 스태프 권한 체크
    const target = await this.prisma.menu.findUnique({
      where: { id },
      select: { storeId: true },
    })
    if (!target) {
      // 삭제 시에도 동일하게 선 체크
      throw new ForbiddenException('삭제할 메뉴를 찾을 수 없습니다.')
    }
    const staff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: target.storeId } },
      select: { id: true },
    })
    if (!staff) {
      throw new ForbiddenException('가게에 대한 삭제 권한이 없습니다.')
    }
    return this.prisma.menu.delete({ where: { id } })
  }

  /**
   * 이미지 업로드용 Presigned POST 생성
   */
  async createMenuImagePresign(
    userId: number,
    uploadMenuImageDto: UploadMenuImageDto,
  ) {
    const { fileIdx, storeId, contentType } = uploadMenuImageDto

    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId } },
      select: { id: true },
    })

    if (!staffInfo) {
      throw new ForbiddenException('가게에 대한 업로드 권한이 없습니다.')
    }

    const extensionMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/heic': 'heic',
      'image/heif': 'heif',
      'image/webp': 'webp',
    }
    const ext = extensionMap[contentType]
    if (!ext) {
      throw new Error('Invalid image content-type')
    }

    const safePostfix = fileIdx.replace(/[^a-zA-Z0-9-_]/g, '-')
    const key = `public/store/${storeId}/menu/${safePostfix}.${ext}`

    const maxSize = 5 * 1024 * 1024

    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, maxSize],
        ['starts-with', '$Content-Type', 'image/'],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 60, // 초
    })

    return {
      url,
      fields,
      key,
      publicUrl: `${this.config.get('S3_PUBLIC_BASE') || this.config.get('S3_ENDPOINT')}/${this.bucket}/${key}`,
      maxSize,
      contentType,
    }
  }
}
