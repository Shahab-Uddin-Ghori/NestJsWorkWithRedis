// Path: src\metrics\metrics.service.ts
import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  register,
  Counter,
  Histogram,
  Gauge,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private httpRequestDuration: Histogram<string>;
  private httpRequestTotal: Counter<string>;
  private activeConnections: Gauge<string>;
  private databaseQueryDuration: Histogram<string>;
  private redisOperations: Counter<string>;

  constructor() {
    // Default system metrics collect karo
    collectDefaultMetrics();

    // Custom metrics define karo
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    this.databaseQueryDuration = new Histogram({
      name: 'database_query_duration_seconds',
      help: 'Duration of database queries',
      labelNames: ['operation', 'collection'],
    });

    this.redisOperations = new Counter({
      name: 'redis_operations_total',
      help: 'Total Redis operations',
      labelNames: ['operation', 'status'],
    });
  }

  getMetrics() {
    return register.metrics();
  }

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestDuration.observe(
      { method, route, status_code: statusCode.toString() },
      duration,
    );
    this.httpRequestTotal.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  recordDatabaseQuery(operation: string, collection: string, duration: number) {
    this.databaseQueryDuration.observe({ operation, collection }, duration);
  }

  recordRedisOperation(operation: string, status: 'success' | 'error') {
    this.redisOperations.inc({ operation, status });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }
}
