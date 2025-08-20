import { Paginated } from './../interfaces/paginated.interface';
import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Repository, ObjectLiteral } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    /**
     * create request Urls
     */
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(baseUrl + this.request.url);

    const totalCount = await repository.count();
    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages ? page + 1 : page;
    const prevPage = page > 1 ? page - 1 : page;
    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalCount,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: newUrl.origin + `?page=1&limit=${limit}`,
        last: newUrl.origin + `?page=${totalPages}&limit=${limit}`,
        current: newUrl.origin + `?page=${page}&limit=${limit}`,
        next: newUrl.origin + `?page=${nextPage}&limit=${limit}`,
        prev: newUrl.origin + `?page=${prevPage}&limit=${limit}`,
      },
    };

    return finalResponse;
  }
}
