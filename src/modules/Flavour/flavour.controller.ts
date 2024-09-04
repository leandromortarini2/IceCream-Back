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
import { FlavourService } from './flavour.service';
import { CreateFlavourDto } from './dto/create-flavour.dto';
import { UpdateFlavourDto } from './dto/update-flavour.dto';
import { Role } from '../Users/entity/users.entity';
import { Roles } from 'src/decorators/role.decorator';
import { TokenGuard } from 'src/guards/token.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('flavour')
export class FlavourController {
  constructor(private readonly flavourService: FlavourService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  create(@Body() createFlavourDto: CreateFlavourDto) {
    return this.flavourService.create(createFlavourDto);
  }

  @Get()
  findAll() {
    return this.flavourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flavourService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  update(@Param('id') id: string, @Body() updateFlavourDto: UpdateFlavourDto) {
    return this.flavourService.update(id, updateFlavourDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.flavourService.remove(id);
  }
}
