import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    // Логируем все POST запросы к auth/register
    if (req.method === 'POST' && req.path === '/auth/register') {
      this.logger.log('Raw request headers:', req.headers);
      this.logger.log('Raw request body (raw):', req.body);
      
      // Логируем после того как body parser сработает
      const originalJson = res.json;
      res.json = function(data) {
        LoggerMiddleware.logger.log('Response data:', data);
        return originalJson.call(res, data);
      };
    }
    next();
  }

  private static logger = new Logger('HTTP');
}
