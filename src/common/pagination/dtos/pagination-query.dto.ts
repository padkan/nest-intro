import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  limit?: number = 10;
}
