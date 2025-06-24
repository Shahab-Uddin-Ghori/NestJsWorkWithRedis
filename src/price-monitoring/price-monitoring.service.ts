// Path: src\price-monitoring\price-monitoring.service.ts
// NEW FILE: src/price-monitoring/price-monitoring.service.ts
// ADDED: Complete crypto price monitoring service with email alerts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from '../email/email.service'; // ADDED: Using existing email service

// ADDED: Interface for crypto price data
interface CryptoPrice {
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  lastUpdated: Date;
}

@Injectable()
export class PriceMonitoringService {
  // ADDED: Demo price thresholds for alerts
  private readonly PRICE_THRESHOLDS = {
    BTC: { high: 50000, low: 30000 }, // ADDED: BTC price alert limits
    ETH: { high: 3000, low: 1500 }, // ADDED: ETH price alert limits
    DOGE: { high: 0.5, low: 0.1 }, // ADDED: DOGE price alert limits
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // ADDED: Redis for price storage
    private emailService: EmailService, // ADDED: Email service for alerts
  ) {}

  // ADDED: Initialize demo prices in Redis
  async initializePrices(): Promise<void> {
    const initialPrices: CryptoPrice[] = [
      {
        symbol: 'BTC',
        currentPrice: 35000, // ADDED: Starting BTC price
        previousPrice: 35000,
        changePercent: 0,
        lastUpdated: new Date(),
      },
      {
        symbol: 'ETH',
        currentPrice: 2000, // ADDED: Starting ETH price
        previousPrice: 2000,
        changePercent: 0,
        lastUpdated: new Date(),
      },
      {
        symbol: 'DOGE',
        currentPrice: 0.25, // ADDED: Starting DOGE price
        previousPrice: 0.25,
        changePercent: 0,
        lastUpdated: new Date(),
      },
    ];

    // ADDED: Store initial prices in Redis
    for (const price of initialPrices) {
      await this.cacheManager.set(`price_${price.symbol}`, price, 0);
    }

    console.log('💰 Demo crypto prices initialized!');
  }

  // ADDED: Update price with random fluctuation
  async updatePrice(symbol: string): Promise<CryptoPrice> {
    try {
      const currentData = await this.cacheManager.get<CryptoPrice>(
        `price_${symbol}`,
      );

      if (!currentData) {
        throw new Error(`Price data not found for ${symbol}`);
      }

      // ADDED: Generate random price change (-5% to +5%)
      const changePercent = (Math.random() - 0.5) * 10; // ADDED: Random -5% to +5%
      const newPrice = currentData.currentPrice * (1 + changePercent / 100);

      // ADDED: Create updated price object
      const updatedPrice: CryptoPrice = {
        symbol,
        currentPrice: Math.round(newPrice * 100) / 100, // ADDED: Round to 2 decimals
        previousPrice: currentData.currentPrice,
        changePercent: Math.round(changePercent * 100) / 100,
        lastUpdated: new Date(),
      };

      // ADDED: Store updated price in Redis
      await this.cacheManager.set(`price_${symbol}`, updatedPrice, 0);

      console.log(
        `📈 ${symbol}: $${updatedPrice.currentPrice} (${updatedPrice.changePercent > 0 ? '+' : ''}${updatedPrice.changePercent}%)`,
      );

      // ADDED: Check for price alerts
      await this.checkPriceAlerts(updatedPrice);

      return updatedPrice;
    } catch (error) {
      console.error(`❌ Price update error for ${symbol}:`, error.message);
      throw error;
    }
  }

  // ADDED: Check if price crossed alert thresholds
  private async checkPriceAlerts(priceData: CryptoPrice): Promise<void> {
    const threshold = this.PRICE_THRESHOLDS[priceData.symbol];

    if (!threshold) return;

    // ADDED: Check high price alert
    if (priceData.currentPrice >= threshold.high) {
      await this.sendPriceAlert(
        priceData,
        'HIGH',
        `${priceData.symbol} price reached $${priceData.currentPrice} (Above $${threshold.high} threshold)`,
      );
    }

    // ADDED: Check low price alert
    if (priceData.currentPrice <= threshold.low) {
      await this.sendPriceAlert(
        priceData,
        'LOW',
        `${priceData.symbol} price dropped to $${priceData.currentPrice} (Below $${threshold.low} threshold)`,
      );
    }
  }

  // ADDED: Send price alert email
  private async sendPriceAlert(
    priceData: CryptoPrice,
    alertType: 'HIGH' | 'LOW',
    message: string,
  ): Promise<void> {
    try {
      await this.emailService.sendAlertEmail(
        'ak8855105@gmail.com', // ADDED: Admin email for alerts
        `🚨 ${alertType} Price Alert: ${priceData.symbol}`,
        message,
      );
      console.log(`✅ ${alertType} price alert sent for ${priceData.symbol}`);
    } catch (error) {
      console.error(`❌ Price alert email failed:`, error.message);
    }
  }

  // ADDED: Get all current prices
  async getAllPrices(): Promise<CryptoPrice[]> {
    const symbols = ['BTC', 'ETH', 'DOGE'];
    const prices: CryptoPrice[] = [];

    for (const symbol of symbols) {
      try {
        const price = await this.cacheManager.get<CryptoPrice>(
          `price_${symbol}`,
        );
        if (price) {
          prices.push(price);
        }
      } catch (error) {
        console.error(`❌ Error getting price for ${symbol}:`, error.message);
      }
    }

    return prices;
  }
}
