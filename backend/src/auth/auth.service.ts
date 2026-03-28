import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { Email: email },
      include: { Role: true },
    });

    if (user && (await bcrypt.compare(password, user.Password))) {
      const { Password, ...result } = user;
      return { ...result, role: user.Role };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.Email, sub: user.IDUsers };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.IDUsers,
        email: user.Email,
        fio: user.FIO,
        role: user.role.Name,
      },
    };
  }

  async register(userData: {
    FIO: string;
    Email: string;
    Password: string;
    Phone: string;
    BirthDate: Date;
    IDRoles: number;
    IDJob_title: number;
  }) {
    const hashedPassword = await bcrypt.hash(userData.Password, 10);

    const user = await this.prisma.users.create({
      data: {
        ...userData,
        Password: hashedPassword,
      },
      include: { Role: true },
    });

    const { Password, ...result } = user;
    return { ...result, role: user.Role };
  }
}
