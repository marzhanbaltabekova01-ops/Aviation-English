// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Неверный email или пароль');

    const { passwordHash: _, ...safeUser } = user;
    return {
      access_token: this.sign(user.id, user.email, user.role),
      user: safeUser,
    };
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email уже занят');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        specialization: dto.specialization as any,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, specialization: true, createdAt: true },
    });

    return {
      access_token: this.sign(user.id, user.email, user.role),
      user,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, specialization: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  private sign(userId: string, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, email, role });
  }
}
