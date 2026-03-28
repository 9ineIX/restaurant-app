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
import { IngredientsService } from './ingredients.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ingredients')
@Controller('ingredients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({ status: 200, description: 'List of all ingredients' })
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all ingredient categories' })
  @ApiResponse({ status: 200, description: 'List of all ingredient categories' })
  getCategories() {
    return this.ingredientsService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ingredient by id' })
  @ApiResponse({ status: 200, description: 'Ingredient found' })
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new ingredient' })
  @ApiResponse({ status: 201, description: 'Ingredient created' })
  create(@Body() createIngredientDto: any) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update ingredient' })
  @ApiResponse({ status: 200, description: 'Ingredient updated' })
  update(@Param('id') id: string, @Body() updateIngredientDto: any) {
    return this.ingredientsService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete ingredient' })
  @ApiResponse({ status: 200, description: 'Ingredient deleted' })
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id);
  }
}
