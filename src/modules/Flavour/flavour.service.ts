import { Injectable } from '@nestjs/common';
import { CreateFlavourDto } from './dto/create-flavour.dto';
import { UpdateFlavourDto } from './dto/update-flavour.dto';

@Injectable()
export class FlavourService {
  create(createFlavourDto: CreateFlavourDto) {
    return 'This action adds a new flavour';
  }

  findAll() {
    return `This action returns all flavour`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flavour`;
  }

  update(id: number, updateFlavourDto: UpdateFlavourDto) {
    return `This action updates a #${id} flavour`;
  }

  remove(id: number) {
    return `This action removes a #${id} flavour`;
  }
}
