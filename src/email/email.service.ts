// Path: src\email\email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Gmail SMTP configuration
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shahabnisar918@gmail.com', // Your Gmail
        pass: 'jjpa sjif rjsc vufu', // Gmail App Password
      },
    });
  }

  async sendWelcomeEmail(to: string, userName: string) {
    console.log(`📧 Sending welcome email to: ${to}`);

    try {
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: to,
        subject: 'Welcome to Our App!',
        html: `
          <h2>Welcome ${userName}!</h2>
          <p>Thank you for joining our platform.</p>
          <p>We're excited to have you on board!</p>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      return result;
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      throw error;
    }
  }
}
