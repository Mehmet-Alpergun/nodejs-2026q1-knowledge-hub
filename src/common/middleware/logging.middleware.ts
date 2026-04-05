import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Runs before every route handler. Logs METHOD, URL, status, duration.
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();
    res.on('finish', () => {
      this.logger.log(
        `${method} ${originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`,
      );
    });
    next();
  }
}
