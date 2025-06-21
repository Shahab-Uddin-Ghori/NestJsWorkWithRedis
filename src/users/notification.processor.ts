// Path: src\users\notification.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notification')
export class NotificationProcessor {
  @Process('welcome')
  
  async handleWelcomeJob(job: Job) {
    const { userName, userEmail } = job.data;
    console.log('🎉 Processing welcome notification job...');
    console.log(`👤 User: ${userName}`);
    console.log(`📧 Email: ${userEmail}`);

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('✅ Welcome notification sent successfully!');
    return { status: 'completed', user: userName };
  }
}
