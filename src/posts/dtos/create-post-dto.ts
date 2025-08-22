import {
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsArray,
  IsNotEmpty,
  Matches,
  IsUrl,
  IsISO8601,
  ValidateNested,
  IsJSON,
  MaxLength,
  IsInt,
  isNotEmpty,
  IsDateString,
} from 'class-validator';
import { postStatus } from '../enums/postStatus.enum';
import { postType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(512)
  title!: string;

  @ApiProperty({
    enum: postType,
    description: 'The type of the post (post, page, story, series)',
    example: postType.POST,
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType!: postType;

  @ApiProperty({
    example: 'my-first-post',
    description: 'A unique slug for the post, used in the URL',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase and can only contain letters, numbers, and hyphens.',
  })
  @ApiProperty()
  @IsString()
  @MaxLength(256)
  slug!: string;

  @ApiProperty({
    enum: postStatus,
    description: 'The status of the post (draft, published, review)',
    example: postStatus.DRAFT,
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status!: postStatus;

  @ApiPropertyOptional({
    example: 'This is the content of my first post.',
    description: 'The content of the post, can be HTML or Markdown',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example: '{"type": "object", "properties": {"title": {"type": "string"}}}',
    description: 'The JSON schema for the post content',
  })
  @IsString()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/my-first-post',
    description: 'The canonical URL of the post',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the post was published',
  })
  @IsOptional()
  @IsDateString() // 👈 automatically converts string → Date
  publishedOn?: Date | null;

  @ApiProperty({
    example: [1, 2],
    description: 'An array of tag Ids',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    type: 'object',
    properties: {
      metaValue: {
        type: 'string',
        example: '{"sidebarEnabled": true, "footerActive": true}',
        description: 'The metaValue is a json string',
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions!: CreatePostMetaOptionsDto | null;
}
