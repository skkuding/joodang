import { IsString } from 'class-validator'

export class UploadStoreImageDto {
  @IsString()
  contentType: string

  @IsString()
  fileIdx: string
}
