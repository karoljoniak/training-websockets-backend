import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { replyJsonException } from './exception-response.helper';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Wystąpił nieoczekiwany błąd serwera';

    switch (exception.code) {
      case 'P2002':
        httpStatus = HttpStatus.CONFLICT;
        message = 'Ten rekord już istnieje w bazie danych';
        break;
      case 'P2025':
        httpStatus = HttpStatus.NOT_FOUND;
        message = 'Nie znaleziono żądanego elementu';
        break;
    }

    replyJsonException(this.httpAdapterHost, host, httpStatus, message);
  }
}
