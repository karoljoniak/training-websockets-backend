import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { replyJsonException } from './exception-response.helper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const httpStatus = exception.getStatus();
    const response = exception.getResponse();
    const message =
      typeof response === 'object'
        ? (response as { message?: string | string[] }).message ?? exception.message
        : response;
    replyJsonException(this.httpAdapterHost, host, httpStatus, message);
  }
}
