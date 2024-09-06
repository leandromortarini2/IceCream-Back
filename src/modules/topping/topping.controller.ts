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
import { ToppingService } from './topping.service';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { TokenGuard } from 'src/guards/token.guard';
import { Role } from '../Users/entity/users.entity';
import { Roles } from 'src/decorators/role.decorator';

@Controller('topping')
export class ToppingController {
  constructor(private readonly toppingService: ToppingService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  create(@Body() createToppingDto: CreateToppingDto) {
    return this.toppingService.create(createToppingDto);
  }

  @Get()
  findAll() {
    return this.toppingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toppingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateToppingDto: UpdateToppingDto) {
    return this.toppingService.update(id, updateToppingDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.toppingService.remove(id);
  }
}
