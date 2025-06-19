// Path: src\users\users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService   {
  // injecting user database model here
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // method 1 to create User 
  async createUser(userData: { name: string; email: string ; password: string }): Promise<User> {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  // method 2 to get all users
  async getAllUsers():Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null >{
    return await this.userModel.findOne({email}).exec();
  }
}
