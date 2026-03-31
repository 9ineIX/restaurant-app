import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

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
    const password = userData.Password ?? userData.password;
    const preparedUserData = { ...userData };

    if (password) {
      preparedUserData.Password = await bcrypt.hash(password, 10);
      delete preparedUserData.password;
    }

    return this.prisma.users.create({
      data: preparedUserData,
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
