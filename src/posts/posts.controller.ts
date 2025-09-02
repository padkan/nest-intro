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
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post-dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostDto } from './dtos/get-post.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
//import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    @Inject('winston') private readonly logger: Logger,
  ) {
    this.logger.warn('PostsController initialized');
  }

  @Get('{/:userId}')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostDto,
  ) {
    // console.log('postQuery', postQuery);
    // console.log('userId', userId);
    return this.postsService.findAll(postQuery, userId);
  }

  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    console.log(user);
    return this.postsService.create(createPostDto, user);
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

  @Roles(Role.User, Role.Editor)
  @UseGuards(RolesGuard)
  //@UseGuards(AuthenticationGuard) // order is important
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
