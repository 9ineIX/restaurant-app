import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('dishes')
@Controller('dishes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all dishes' })
  @ApiResponse({ status: 200, description: 'List of all dishes' })
  findAll() {
    return this.dishesService.findAll();
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all dish types' })
  @ApiResponse({ status: 200, description: 'List of all dish types' })
  getTypes() {
    return this.dishesService.getDishTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dish by id' })
  @ApiResponse({ status: 200, description: 'Dish found' })
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(+id);
  }

  @Post('match')
  @ApiOperation({ summary: 'Match dish by ingredients' })
  @ApiResponse({ status: 200, description: 'Dish match result' })
  matchDish(@Body() matchDto: { 
    ingredients: { id: number; quantity: number }[];
    includeExtra?: boolean; // Новый параметр для подтверждения лишних ингредиентов
  }) {
    return this.dishesService.matchDish(matchDto.ingredients, matchDto.includeExtra);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new dish' })
  @ApiResponse({ status: 201, description: 'Dish created' })
  create(@Body() createDishDto: any) {
    return this.dishesService.create(createDishDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update dish' })
  @ApiResponse({ status: 200, description: 'Dish updated' })
  update(@Param('id') id: string, @Body() updateDishDto: any) {
    return this.dishesService.update(+id, updateDishDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete dish' })
  @ApiResponse({ status: 200, description: 'Dish deleted' })
  remove(@Param('id') id: string) {
    return this.dishesService.remove(+id);
  }
}
