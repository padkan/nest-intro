import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'The ID of the user',
    example: 1,
    required: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public id?: number;

  @IsOptional()
  @IsString()
  public optional?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  public limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  public page?: number;
}
