import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'jan.kowalski@example.com',
    description: 'Unikalny adres email (zapisany małymi literami)',
  })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @ApiProperty({
    format: 'password',
    minLength: 8,
    maxLength: 50,
    description: 'Hasło (min. 8 znaków)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password!: string;
}
