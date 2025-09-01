import { CreatePostProvider } from './create-post.provider';
import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option-entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination-provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
    //let tags: Tag[] = [];
    // const metaOptions = createPostDto.metaOptions
    //   ? this.metaOptionsRepository.create(createPostDto.metaOptions)
    //   : null;
    // if (metaOptions) {
    //   await this.metaOptionsRepository.save(metaOptions);
    // }
    // if (createPostDto.tags) {
    //   tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // }

    // const author = await this.usersService.findOneById(createPostDto.authorId);
    // if (!author) {
    //   throw new NotFoundException('Author not found');
    // }
    // const post = this.postsRepository.create({
    //   ...createPostDto,
    //   author,
    //   tags,
    // });

    // if (metaOptions) {
    //   post.metaOptions = metaOptions;
    // }
    //post.user = await this.usersService.findOneById(1);

    //return await this.postsRepository.save(post);
  }

  public async findAll(
    postQuery: GetPostDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    //const user = this.usersService.findOneById(userId);

    const posts = await this.paginationProvider.paginateQuery(
      {
        page: postQuery.page,
        limit: postQuery.limit,
      },
      this.postsRepository,
    );
    return posts;
  }

  public async delete(id: number) {
    // find the post
    const post = await this.postsRepository.findOneBy({ id });

    // delete post then delete related rows like meta options
    // if (post) {
    //   await this.postsRepository.delete(id);
    //   if (post.metaOptions) {
    //     await this.metaOptionsRepository.delete(post.metaOptions.id);
    //   }
    // }

    // const inversePost = await this.metaOptionsRepository.findOne({
    //   where: { id: post?.metaOptions?.id },
    //   relations: ['post'],
    // });
    // console.log('inversePost', inversePost);
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] = [];
    let post = undefined;
    try {
      if (patchPostDto.tags) {
        tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
      }
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
      );
    }
    if (
      !patchPostDto.tags ||
      !tags ||
      tags.length !== patchPostDto.tags.length
    ) {
      throw new BadRequestException('Some tags not found');
    }
    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
      );
    }
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;
    post.tags = tags;
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
      );
    }

    return post;
  }
}
