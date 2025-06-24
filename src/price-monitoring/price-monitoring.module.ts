// Path: src\price-monitoring\price-monitoring.module.ts
//  Complete module for price monitoring feature
import { Module } from '@nestjs/common';
import { PriceMonitoringService } from './price-monitoring.service'; //  Import monitoring service
import { PriceMonitoringCron } from './price-monitoring.cron'; // Import cron job class
import { EmailModule } from '../email/email.module'; //  Import existing email module

@Module({
  imports: [
    EmailModule, //  Import email module for sending alerts
  ],
  providers: [
    PriceMonitoringService, //  Register price monitoring service
    PriceMonitoringCron, //  Register cron job as provider
  ],
  exports: [
    PriceMonitoringService, //  Export service for use in other modules
  ],
})
export class PriceMonitoringModule {}
