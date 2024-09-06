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
import { SalsasService } from './salsas.service';
import { CreateSalsaDto } from './dto/create-salsa.dto';
import { UpdateSalsaDto } from './dto/update-salsa.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { TokenGuard } from 'src/guards/token.guard';
import { Role } from '../Users/entity/users.entity';
import { Roles } from 'src/decorators/role.decorator';

@Controller('salsas')
export class SalsasController {
  constructor(private readonly salsasService: SalsasService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  create(@Body() createSalsaDto: CreateSalsaDto) {
    return this.salsasService.create(createSalsaDto);
  }

  @Get()
  findAll() {
    return this.salsasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salsasService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateSalsaDto: UpdateSalsaDto) {
    return this.salsasService.update(id, updateSalsaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.salsasService.remove(id);
  }
}
