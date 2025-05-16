import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusinessError, BusinessErrorType } from '../business-error';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        if (error instanceof BusinessError) {
          switch(error.type) {
            case BusinessErrorType.NOT_FOUND:
              throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            case BusinessErrorType.PRECONDITION_FAILED:
              throw new HttpException(error.message, HttpStatus.PRECONDITION_FAILED);
            case BusinessErrorType.BAD_REQUEST:
              throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            case BusinessErrorType.CONFLICT:
              throw new HttpException(error.message, HttpStatus.CONFLICT);
            default:
              throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        } else {
          throw error;
        }
      }));
  }
}
