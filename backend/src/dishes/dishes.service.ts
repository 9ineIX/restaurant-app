import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dishes.findMany({
      include: {
        DishType: true,
        Ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.dishes.findUnique({
      where: { IDDishes: id },
      include: {
        DishType: true,
        Ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });
  }

  async create(createDishDto: any) {
    const { selectedIngredients, Ingredients, ...dishData } = createDishDto;
    
    // Временно создаем блюдо без ингредиентов
    return this.prisma.dishes.create({
      data: {
        Name: dishData.Name,
        Price: dishData.Price,
        Description: dishData.Description,
        IDDish_types: dishData.IDDish_types,
      },
      include: {
        DishType: true,
        Ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });
  }

  async update(id: number, updateDishDto: any) {
    return this.prisma.dishes.update({
      where: { IDDishes: id },
      data: updateDishDto,
      include: {
        DishType: true,
        Ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.dishes.delete({
      where: { IDDishes: id },
    });
  }

  async getDishTypes() {
    return this.prisma.dish_types.findMany();
  }

  async matchDish(selectedIngredients: { id: number; quantity: number }[], includeExtra = false) {
    const allDishes = await this.prisma.dishes.findMany({
      include: {
        Ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });

    const selectedIngredientIds = selectedIngredients.map(item => item.id);

    const dishMatches = allDishes.map(dish => {
      const dishIngredientIds = dish.Ingredients.map(di => di.IDIngredients);
      
      const intersection = selectedIngredientIds.filter(id => 
        dishIngredientIds.includes(id)
      );
      
      const missing = dishIngredientIds.filter(id => 
        !selectedIngredientIds.includes(id)
      );
      
      const extra = selectedIngredientIds.filter(id => 
        !dishIngredientIds.includes(id)
      );

      // Если includeExtra=true, то лишние ингредиенты не учитываются в проценте совпадения
      let matchPercentage = dishIngredientIds.length > 0 
        ? (intersection.length / dishIngredientIds.length) * 100 
        : 0;

      // Если есть лишние ингредиенты и includeExtra=false, снижаем процент совпадения
      if (extra.length > 0 && !includeExtra) {
        matchPercentage = Math.max(0, matchPercentage - (extra.length * 10));
      }

      return {
        dish,
        matchPercentage,
        intersection: intersection.length,
        missing: missing.length,
        extra: extra.length,
        missingIngredients: missing.map(id => 
          dish.Ingredients.find(di => di.IDIngredients === id)
        ),
        extraIngredients: extra,
        hasExtraIngredients: extra.length > 0,
        needsConfirmation: extra.length > 0 && !includeExtra,
      };
    });

    dishMatches.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return a.missing - b.missing;
    });

    return {
      bestMatch: dishMatches[0] || null,
      allMatches: dishMatches,
    };
  }
}
