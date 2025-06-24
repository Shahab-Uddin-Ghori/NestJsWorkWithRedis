// Path: src\users\dto\create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

// New class CreateUserDto for type safety and documentation

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name', //  Field description for Swagger UI
    example: 'John Doe', //  Example value shown in Swagger
    minLength: 2, //  Minimum length validation info
  })
  name: string;

  // ApiProperty decorator for email field with format validation
  @ApiProperty({
    description: 'User email address', //  Email field description
    example: 'john@example.com', //  Email example
    format: 'email', //  Email format validation for Swagger
  })
  email: string;

  //ApiProperty decorator for password field
  @ApiProperty({
    description: 'User password', //  Password field description
    example: 'password123', //  Password example
    minLength: 6, //  Password minimum length requirement
  })
  password: string;
}
