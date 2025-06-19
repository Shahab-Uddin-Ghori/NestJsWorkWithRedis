// Path: src\users\users.controller.ts
import { Controller, Get, Post, Body,Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

// tell all endpoint start with /user
@Controller('users')
export class UsersController {
  // Injects UsersService into controller
  constructor(private readonly usersService: UsersService) {}

  // HTTP POST request handler
  @Post()

  // creating new user
  async createUser(
    @Body() userData: { name: string; email: string; password: string },
  ): Promise<User> {
    return await this.usersService.createUser(userData);
  }

  //getting existing user
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  //   find user by email
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }
}
