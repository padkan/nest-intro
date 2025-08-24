import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  Headers,
  Ip,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserManyDto } from './dtos/create-user-many.dto';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@metadata('authType', 'none')
  @Auth(AuthType.None)
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //@UseGuards(AccessTokenGuard) in app module define as global
  @Post('create-many')
  public createManyUsers(@Body() createUserManyDto: CreateUserManyDto) {
    return this.usersService.createMany(createUserManyDto);
  }
  @Patch()
  public updateUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }

  @Put(':id')
  public replaceUser() {
    return 'This action replaces a user';
  }

  @Delete(':id')
  public deleteUser() {
    return 'This action removes a user';
  }

  @Get('{/:id}{/:optional}')
  @ApiOperation({
    summary: 'Get user by ID with optional parameter or list of users',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users or a specific user by ID',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit the number of results',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  public getUserById(
    @Param() params: GetUsersParamDto,
    @Param() optional: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(params, limit, page);
  }
}
