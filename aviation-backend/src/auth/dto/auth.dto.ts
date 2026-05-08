// src/auth/dto/auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'pilot@test.kz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user123456' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Азамат' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Сейткали' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'pilot@test.kz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user123456' })
  @IsString()
  passwordConfirm: string;

  @ApiProperty({ example: 'PILOT_COMMERCIAL' })
  @IsString()
  specialization: string;
}
