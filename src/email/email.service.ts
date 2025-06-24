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

  async sendAlertEmail(to: string, subject: string, message: string) {
    console.log(`🚨 Sending alert email to: ${to}`);

    try {
      const mailOptions = {
        from: 'jilanianas13@gmail.com', // UPDATED: Proper from address
        to: to,
        subject: subject, // ADDED: Dynamic subject for alerts
        html: `
          <h2>🚨 Price Alert!</h2>
          <p><strong>${message}</strong></p>
          <p>Time: ${new Date().toLocaleString()}</p>
          <hr>
          <p><small>This is an automated alert from your Trading App</small></p>
          <p><small>Your Bitcoin may lose</small></p>
        `, // ADDED: Professional alert email template
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Alert email sent successfully!');
      return result;
    } catch (error) {
      console.error('❌ Alert email sending failed:', error.message);
      throw error;
    }
  }
}
