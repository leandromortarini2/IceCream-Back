import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlavourService } from './flavour.service';
import { CreateFlavourDto } from './dto/create-flavour.dto';
import { UpdateFlavourDto } from './dto/update-flavour.dto';

@Controller('flavour')
export class FlavourController {
  constructor(private readonly flavourService: FlavourService) {}

  // @Post()
  // create(@Body() createFlavourDto: CreateFlavourDto) {
  //   return this.flavourService.create(createFlavourDto);
  // }

  @Get()
  findAll() {
    return this.flavourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flavourService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlavourDto: UpdateFlavourDto) {
    return this.flavourService.update(id, updateFlavourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flavourService.remove(id);
  }
}
