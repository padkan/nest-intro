import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post-dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: string) {
    console.log('userId', userId);
    return this.postsService.findAll(userId);
  }

  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiOperation({ summary: 'Update an existing post' })
  @Patch()
  public updatePost(@Body() updatePostDto: PatchPostDto) {
    return this.postsService.update(updatePostDto);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
