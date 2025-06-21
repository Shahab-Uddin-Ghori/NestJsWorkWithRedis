// Path: src\users\users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  // 1. Get all users with Redis caching
  async getAllUsers(): Promise<User[]> {
    const cacheKey = 'all_users';

    try {
      const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);
      if (cachedUsers) {
        console.log('✅ Data from Redis cache!');
        return cachedUsers;
      }
    } catch (err) {
      console.error('⚠️ Redis cache error:', err.message);
    }

    console.log('ℹ️ Data from MongoDB!');
    const users = await this.userModel.find().lean().exec();

    try {
      await this.cacheManager.set(cacheKey, users, 300 * 1000);
    } catch (err) {
      console.error('⚠️ Redis set error:', err.message);
    }

    return users;
  }

  // 2. Fixed findByEmail with Redis caching
  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `user_email_${email}`;

    try {
      const cachedUser = await this.cacheManager.get<User>(cacheKey);
      if (cachedUser) {
        console.log(`✅ User ${email} from Redis cache!`);
        return cachedUser;
      }
    } catch (err) {
      console.error('⚠️ Redis cache error:', err.message);
    }

    console.log(`ℹ️ Fetching user ${email} from MongoDB!`);
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (user) {
      try {
        await this.cacheManager.set(cacheKey, user, 300 * 1000);
      } catch (err) {
        console.error('⚠️ Redis set error:', err.message);
      }
    }

    return user;
  }

  // 3. Create user with cache invalidation
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const newUser = new this.userModel(userData);
    const result = await newUser.save();

    await this.notificationQueue.add('welcome', {
      userName: userData.name,
      userEmail: userData.email,
    });

    try {
      // Clear all users cache
      await this.cacheManager.del('all_users');
      // Clear individual email cache if exists
      await this.cacheManager.del(`user_email_${userData.email}`);
      console.log('♻️ Cache cleared after new user!');
    } catch (err) {
      console.error('⚠️ Cache clear error:', err.message);
    }

    return result;
  }
}
