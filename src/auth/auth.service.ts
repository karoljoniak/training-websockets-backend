import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { COOKIE_EXPIRY } from './auth.constants';
import type { AuthSessionPayload, AuthUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSessionPayload> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash },
      select: { id: true, email: true },
    });

    return this.createSession(user, false);
  }

  async login(dto: LoginDto): Promise<AuthSessionPayload> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
  
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowe dane logowania');
    }
  
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Nieprawidłowe dane logowania');
    }
  
    return this.createSession(user, dto.remember);
  }

  async createSession(user: AuthUser, remember: boolean | undefined): Promise<AuthSessionPayload> {
    const expiresIn = remember 
      ? this.config.get('JWT_EXPIRES_REMEMBER', '30d') 
      : this.config.get('JWT_EXPIRES_IN', '7d');

    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { expiresIn }
    );

    return { 
      accessToken,
      user,
      cookieOptions: {
        httpOnly: true,
        secure: this.config.get('NODE_ENV') === 'production',
        sameSite: this.config.get<string>('AUTH_COOKIE_SAMESITE', 'lax') as 'lax',
        path: '/',
        maxAge: remember ? COOKIE_EXPIRY.REMEMBER : COOKIE_EXPIRY.DEFAULT,
      }, 
    };
  }
}