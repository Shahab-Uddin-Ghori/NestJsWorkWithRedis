// Path: src\users\user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// tell the typescript what the properties are in user document
export type UserDocument = User & Document;

/*
@Controller = API endpoint handler (NestJS)
@Injectable = Service class (NestJS)
@Get = HTTP GET route (NestJS) */

// basic structure of schemea
@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  //What is @Prop?
  // A decorator from Mongoose that tells MongoDB "this is a database field"
  @Prop({
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Invalid email format',
    ],
  })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
