import {
  Injectable,
  Body,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post-dto';
import { Tag } from 'src/tags/tag.entity';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    author = await this.usersService.findOneById(user.sub);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    let tags: Tag[] = [];
    if (createPostDto.tags) {
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    }
    if (createPostDto.tags?.length !== tags.length) {
      throw new NotFoundException('Some tags not found');
    }
    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicated',
      });
    }
  }
}
