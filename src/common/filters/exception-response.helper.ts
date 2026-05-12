import { ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export function replyJsonException(
  httpAdapterHost: HttpAdapterHost,
  host: ArgumentsHost,
  httpStatus: number,
  message: string | string[],
): void {
  const { httpAdapter } = httpAdapterHost;
  const ctx = host.switchToHttp();
  httpAdapter.reply(
    ctx.getResponse(),
    {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    },
    httpStatus,
  );
}
