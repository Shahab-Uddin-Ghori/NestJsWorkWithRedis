// Path: src\app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Learning NestJs with redis , bull, job , and implementation of sonnar cube';
  }
}
