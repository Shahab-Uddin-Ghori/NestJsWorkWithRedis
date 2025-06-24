// Path: src\users\users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
// tell all endpoint start with /user
@Controller('users')
export class UsersController {
  // Injects UsersService into controller
  constructor(private readonly usersService: UsersService) {}

  // HTTP POST request handler
  @Post()

  // summary and description of each api
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create new user account',
  })

  // define the stucture of post api
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       name: { type: 'string', example: 'John Doe' },
  //       email: { type: 'string', example: 'john@example.com' },
  //       password: { type: 'string', example: 'password123' },
  //     },
  //   },
  // }) //this commited bcz we define init CreatUserDto

  // response of new created user
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto, //  Response type documentation
  })

  // creating new user
  async createUser(
    // @Body() userData: { name: string; email: string; password: string }, this is default we link it to dto
    @Body() userData: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.createUser(userData);
  }

  //getting existing user
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users from database',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  //   find user by email
  @Get('email/:email')
  @ApiOperation({
    summary: 'Find user by email',
    description: 'Find specific user by email address',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }
}
