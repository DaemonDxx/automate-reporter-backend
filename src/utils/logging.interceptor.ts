import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = new Date().getMilliseconds();
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    let out = `[Request] ${req.method} - ${req.originalUrl} - `;
    return next.handle().pipe(
      tap((e) => {
        out += `${res.statusCode} - ${new Date().getMilliseconds() - start}ms`;
        this.logger.log(out);
      }),
      catchError((err) => {
        out += `${err.response?.statusCode ?? 500} - ${
          new Date().getMilliseconds() - start
        }ms`;
        this.logger.warn(out);
        this.logger.error(`Message: ${err.message}`);
        this.logger.error(`Params request: `, req.body);
        throw err;
      }),
    );
  }
}
