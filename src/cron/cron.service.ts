// Path: src\cron\cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('*/30 * * * * *')
  handleHealthCheck() {
    const currentTime = new Date().toLocaleString();
    console.log('🔍 Health Check - Server is running fine!');
    console.log(`⏰ Time: ${currentTime}`);
  }

  @Cron('0 * * * * *')
  handleDatabaseCleanup() {
    const currentTime = new Date().toLocaleString();
    console.log('🧹 Database cleanup job started');
    console.log(`⏰ Time: ${currentTime}`);
    // Simulate cleanup work
    console.log('✅ Database cleanup completed');
  }
}
