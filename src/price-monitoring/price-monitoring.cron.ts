// Path: src\price-monitoring\price-monitoring.cron.ts

//  Complete cron job for automatic price updates
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceMonitoringService } from './price-monitoring.service'; //  Import price service

@Injectable()
export class PriceMonitoringCron {
  constructor(
    private readonly priceMonitoringService: PriceMonitoringService, //  Inject price service
  ) {}

  //  Initialize prices when application starts
  async onModuleInit() {
    console.log('🚀 Initializing crypto prices...');
    await this.priceMonitoringService.initializePrices();
  }

  //  Cron job runs every 30 seconds to update prices
  @Cron('*/30 * * * * *') //  Every 30 seconds (for demo purpose)
  async updateCryptoPrices() {
    console.log('⏰ Cron job: Updating crypto prices...');

    try {
      //  Update each crypto price
      await this.priceMonitoringService.updatePrice('BTC');
      await this.priceMonitoringService.updatePrice('ETH');
      await this.priceMonitoringService.updatePrice('DOGE');

      console.log('✅ All crypto prices updated successfully!');
    } catch (error) {
      console.error('❌ Cron job failed:', error.message);
    }
  }

  //  Optional: Manual trigger for testing (runs every 2 minutes)
  @Cron('0 */2 * * * *') //  Every 2 minutes
  async priceHealthCheck() {
    console.log('🔍 Health check: Getting current prices...');

    try {
      const prices = await this.priceMonitoringService.getAllPrices();
      console.log(
        '📊 Current prices:',
        prices.map((p) => `${p.symbol}: $${p.currentPrice}`),
      );
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
    }
  }
}
