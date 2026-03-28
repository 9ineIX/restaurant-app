import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user.IDUsers, req.user.role);
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Get all order statuses' })
  @ApiResponse({ status: 200, description: 'List of order statuses' })
  getStatuses() {
    return this.ordersService.getStatuses();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: 200, description: 'Order found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(+id, req.user.IDUsers, req.user.role);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  create(@Body() createOrderDto: { IDDishes: number[] }, @Request() req) {
    return this.ordersService.create({
      IDUsers: req.user.IDUsers,
      IDDishes: createOrderDto.IDDishes,
    });
  }

  @Patch(':id/status')
  @Roles('EMPLOYEE', 'ADMIN')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { statusId: number },
  ) {
    return this.ordersService.updateStatus(+id, updateStatusDto.statusId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
