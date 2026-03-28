import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ingredients.findMany({
      include: { Category: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.ingredients.findUnique({
      where: { IDIngredients: id },
      include: { Category: true },
    });
  }

  async create(createIngredientDto: any) {
    return this.prisma.ingredients.create({
      data: createIngredientDto,
      include: { Category: true },
    });
  }

  async update(id: number, updateIngredientDto: any) {
    return this.prisma.ingredients.update({
      where: { IDIngredients: id },
      data: updateIngredientDto,
      include: { Category: true },
    });
  }

  async remove(id: number) {
    return this.prisma.ingredients.delete({
      where: { IDIngredients: id },
    });
  }

  async getCategories() {
    return this.prisma.ingredients_categories.findMany();
  }
}
