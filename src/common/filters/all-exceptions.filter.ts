import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { replyJsonException } from './exception-response.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    replyJsonException(
      this.httpAdapterHost,
      host,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Wystąpił nieoczekiwany błąd serwera',
    );
  }
}
