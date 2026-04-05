import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Strips the `password` field from every User response automatically.
// Applied with @UseInterceptors(ExcludePasswordInterceptor) on the UserController.
@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data) ? data.map(this.strip) : this.strip(data),
        ),
      );
  }

  private strip(obj: any): any {
    if (obj && typeof obj === 'object' && 'password' in obj) {
      const { password: _pw, ...rest } = obj;
      return rest;
    }
    return obj;
  }
}
