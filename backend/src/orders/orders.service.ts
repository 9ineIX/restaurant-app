import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: number, userRole?: string) {
    const where = userRole === 'ADMIN' || userRole === 'EMPLOYEE' 
      ? {} 
      : { IDUsers: userId };

    return this.prisma.orders.findMany({
      where,
      include: {
        User: {
          select: {
            IDUsers: true,
            FIO: true,
            Email: true,
          },
        },
        Status: true,
        Dishes: {
          include: {
            Ingredients: {
              include: {
                Ingredient: true,
              },
            },
          },
        },
      },
      orderBy: {
        IDOrders: 'desc',
      },
    });
  }

  async findOne(id: number, userId?: number, userRole?: string) {
    const order = await this.prisma.orders.findUnique({
      where: { IDOrders: id },
      include: {
        User: {
          select: {
            IDUsers: true,
            FIO: true,
            Email: true,
          },
        },
        Status: true,
        Dishes: {
          include: {
            Ingredients: {
              include: {
                Ingredient: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    if (userRole !== 'ADMIN' && userRole !== 'EMPLOYEE' && order.IDUsers !== userId) {
      throw new Error('Access denied');
    }

    return order;
  }

  async create(createOrderDto: {
    IDUsers: number;
    IDDishes: number[];
  }) {
    const dishes = await this.prisma.dishes.findMany({
      where: {
        IDDishes: {
          in: createOrderDto.IDDishes,
        },
      },
    });

    const totalPrice = dishes.reduce((sum, dish) => sum + Number(dish.Price), 0);

    const order = await this.prisma.orders.create({
      data: {
        IDUsers: createOrderDto.IDUsers,
        IDStatus: 1, 
        Price: totalPrice,
        Dishes: {
          connect: createOrderDto.IDDishes.map(id => ({ IDDishes: id })),
        },
      },
      include: {
        User: {
          select: {
            IDUsers: true,
            FIO: true,
            Email: true,
          },
        },
        Status: true,
        Dishes: {
          include: {
            Ingredients: {
              include: {
                Ingredient: true,
              },
            },
          },
        },
      },
    });

    return order;
  }

  async updateStatus(id: number, statusId: number) {
    return this.prisma.orders.update({
      where: { IDOrders: id },
      data: { IDStatus: statusId },
      include: {
        User: {
          select: {
            IDUsers: true,
            FIO: true,
            Email: true,
          },
        },
        Status: true,
        Dishes: {
          include: {
            Ingredients: {
              include: {
                Ingredient: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.orders.delete({
      where: { IDOrders: id },
    });
  }

  async getStatuses() {
    return this.prisma.status.findMany();
  }
}
