// Path: src\users\dto\user-response.dto.ts
// Complete response DTO for better API documentation
import { ApiProperty } from '@nestjs/swagger';

// New class for documenting API responses
export class UserResponseDto {
  // ID field documentation for MongoDB _id
  @ApiProperty({
    description: 'User unique identifier', // ID field description
    example: '507f1f77bcf86cd799439011', // MongoDB ObjectId example
  })
  _id: string;

  // Name field for response documentation
  @ApiProperty({
    description: 'User full name', // Name field description
    example: 'John Doe', // Name example
  })
  name: string;

  // Email field for response documentation
  @ApiProperty({
    description: 'User email address', // Email field description
    example: 'john@example.com', // Email example
  })
  email: string;

  // Created timestamp field
  @ApiProperty({
    description: 'Account creation timestamp', // Timestamp description
    example: '2024-06-24T10:30:00.000Z', // ISO date example
  })
  createdAt: Date;

  // Updated timestamp field
  @ApiProperty({
    description: 'Last update timestamp', // Update timestamp description
    example: '2024-06-24T10:30:00.000Z', // ISO date example
  })
  updatedAt: Date;
}
