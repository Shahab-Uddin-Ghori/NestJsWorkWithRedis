// Path: src\users\users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, NotificationProcessor],
  exports: [UsersService],
})
export class UsersModule {}
