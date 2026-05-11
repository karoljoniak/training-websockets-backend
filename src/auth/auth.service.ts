import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export type AuthUser = { id: string; email: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase().trim(),
          passwordHash,
        },
        select: { id: true, email: true },
      });
      return this.buildAuthResponse(user);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Ten adres email jest już zajęty');
      }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      select: { id: true, email: true, passwordHash: true },
    });
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }
    const { passwordHash: _, ...publicUser } = user;
    return this.buildAuthResponse(publicUser, dto.remember === true);
  }

  private async buildAuthResponse(user: AuthUser, remember?: boolean) {
    const expiresIn = remember
      ? this.config.get<string>('JWT_EXPIRES_REMEMBER', '30d')
      : this.config.get<string>('JWT_EXPIRES_IN', '7d');
    const signOptions: JwtSignOptions = {
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    };
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      signOptions,
    );
    return { accessToken, user };
  }
}
