import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.users.findUnique({
      where: { IDUsers: payload.sub },
      include: { Role: true },
    });

    if (!user) {
      return null;
    }

    const { Password, ...result } = user;
    return { ...result, role: user.Role.Name };
  }
}
