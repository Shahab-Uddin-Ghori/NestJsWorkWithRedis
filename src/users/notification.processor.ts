// Path: src\users\notification.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../email/email.service'; // ← New import

@Processor('notification')
export class NotificationProcessor {
  constructor(private emailService: EmailService) {} // ← Inject email service

  @Process('welcome')
  async handleWelcomeJob(job: Job) {
    const { userName, userEmail } = job.data;
    
    console.log('🎉 Processing welcome notification job...');
    console.log(`👤 User: ${userName}`);
    console.log(`📧 Email: ${userEmail}`);
    
    try {
      // Send actual email
      await this.emailService.sendWelcomeEmail(userEmail, userName);
      console.log('✅ Welcome email sent successfully!');
      
      return { status: 'completed', user: userName };
    } catch (error) {
      console.error('❌ Email job failed:', error.message);
      throw error; // Job will be marked as failed
    }
  }
}