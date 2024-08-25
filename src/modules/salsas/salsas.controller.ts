import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalsasService } from './salsas.service';
import { CreateSalsaDto } from './dto/create-salsa.dto';
import { UpdateSalsaDto } from './dto/update-salsa.dto';

@Controller('salsas')
export class SalsasController {
  constructor(private readonly salsasService: SalsasService) {}

  @Post()
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
  update(@Param('id') id: string, @Body() updateSalsaDto: UpdateSalsaDto) {
    return this.salsasService.update(id, updateSalsaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salsasService.remove(id);
  }
}
