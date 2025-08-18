import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  IsString,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  name!: string;

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

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional()
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;
}
