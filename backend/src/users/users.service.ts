import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { Email: email },
      include: { Role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.users.findUnique({
      where: { IDUsers: id },
      include: { Role: true },
    });
  }

  async create(userData: any) {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(userData.Password, 10);
    
    // Определяем роль: если пришла из frontend - используем её, иначе CLIENT
    let roleId: number;
    if (userData.IDRoles) {
      roleId = userData.IDRoles;
    } else {
      // Ищем роль CLIENT по умолчанию
      let clientRole = await this.prisma.roles.findFirst({
        where: { Name: 'CLIENT' }
      });
      if (!clientRole) {
        clientRole = await this.prisma.roles.create({
          data: { Name: 'CLIENT' }
        });
      }
      roleId = clientRole.IDRoles;
    }

    // Должность по умолчанию - Менеджер
    let managerJob = await this.prisma.job_title.findFirst({
      where: { Name: 'Менеджер' }
    });
    if (!managerJob) {
      managerJob = await this.prisma.job_title.create({
        data: { Name: 'Менеджер' }
      });
    }

    // Обрабатываем дату рождения
    let birthDate: Date;
    if (userData.BirthDate && userData.BirthDate !== '') {
      birthDate = new Date(userData.BirthDate);
      if (isNaN(birthDate.getTime())) {
        birthDate = new Date('2000-01-01');
      }
    } else {
      birthDate = new Date('2000-01-01');
    }

    return this.prisma.users.create({
      data: {
        FIO: userData.FIO,
        Email: userData.Email,
        Password: hashedPassword,
        Phone: userData.Phone || null,
        BirthDate: birthDate,
        Role: {
          connect: { IDRoles: roleId }
        },
        JobTitle: {
          connect: { IDJob_title: managerJob.IDJob_title }
        }
      },
      include: { Role: true },
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      include: { Role: true, JobTitle: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.users.findUnique({
      where: { IDUsers: id },
      include: { Role: true, JobTitle: true },
    });
  }

  async update(id: number, userData: any) {
    return this.prisma.users.update({
      where: { IDUsers: id },
      data: userData,
      include: { Role: true, JobTitle: true },
    });
  }

  async remove(id: number) {
    return this.prisma.users.delete({
      where: { IDUsers: id },
    });
  }
}
