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
    console.log('Login attempt with user data:', user);
    
    // Загружаем пользователя с ролью
    const userWithRole = await this.prisma.users.findUnique({
      where: { Email: user.email },
      include: { Role: true }
    });

    if (!userWithRole) {
      throw new Error('User not found');
    }

    const payload = { email: userWithRole.Email, sub: userWithRole.IDUsers };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: userWithRole.IDUsers,
        email: userWithRole.Email,
        fio: userWithRole.FIO,
        role: userWithRole.Role.Name,
      },
    };
  }

  async register(userData: any) {
    console.log('AuthService.register received userData:', userData);
    
    try {
      // Сначала убедимся, что роль CLIENT существует
      let clientRole = await this.prisma.roles.findFirst({
        where: { Name: 'CLIENT' }
      });

      if (!clientRole) {
        console.log('CLIENT role not found, creating...');
        clientRole = await this.prisma.roles.create({
          data: { Name: 'CLIENT' }
        });
        console.log('CLIENT role created with ID:', clientRole.IDRoles);
      }

      // Убедимся, что должность существует
      let managerJob = await this.prisma.job_title.findFirst({
        where: { Name: 'Менеджер' }
      });

      if (!managerJob) {
        console.log('Manager job title not found, creating...');
        managerJob = await this.prisma.job_title.create({
          data: { Name: 'Менеджер' }
        });
        console.log('Manager job title created with ID:', managerJob.IDJob_title);
      }

      const hashedPassword = await bcrypt.hash(userData.Password, 10);

      console.log('Creating user with data:', {
        FIO: userData.FIO,
        Email: userData.Email,
        Password: '***hashed***',
        Phone: userData.Phone,
        BirthDate: new Date(userData.BirthDate),
        IDRoles: clientRole.IDRoles,
        IDJob_title: managerJob.IDJob_title,
      });

      const user = await this.prisma.users.create({
        data: {
          FIO: userData.FIO,
          Email: userData.Email,
          Password: hashedPassword,
          Phone: userData.Phone,
          BirthDate: new Date(userData.BirthDate),
          IDRoles: clientRole.IDRoles, // Используем ID существующей или созданной роли
          IDJob_title: managerJob.IDJob_title, // Используем ID существующей или созданной должности
        },
        include: { 
          Role: true,
          JobTitle: true 
        },
      });

      console.log('User created successfully:', user);

      const { Password, ...result } = user;
      return { ...result, role: user.Role };
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  }
}
