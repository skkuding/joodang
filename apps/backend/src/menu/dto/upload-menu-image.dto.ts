import { IsInt, IsString, Min } from 'class-validator'

export class UploadMenuImageDto {
  @IsString()
  contentType: string

  @IsString()
  fileIdx: string

  @IsInt()
  @Min(1)
  storeId: number
}
