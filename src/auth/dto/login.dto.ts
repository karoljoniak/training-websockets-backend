import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'jan.kowalski@example.com',
    description: 'Adres email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    format: 'password',
    description: 'Hasło',
  })
  @IsString()
  @MinLength(1)
  password!: string;

  @ApiPropertyOptional({
    default: false,
    description: 'Dłuższy czas życia tokenu JWT (np. 30 dni zamiast 7)',
  })
  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}
