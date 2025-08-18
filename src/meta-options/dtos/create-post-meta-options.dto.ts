import { IsNotEmpty, IsJSON } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsJSON()
  @IsNotEmpty()
  metaValue!: string;
}
