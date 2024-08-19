import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlavourDto } from './dto/create-flavour.dto';
import { UpdateFlavourDto } from './dto/update-flavour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavour } from './entities/flavour.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlavourService {
  constructor(
    @InjectRepository(Flavour) private flavourRepository: Repository<Flavour>,
  ) {}
  async create(createFlavourDto: CreateFlavourDto) {
    const existsFlavour = await this.flavourRepository.findOne({
      where: { name: createFlavourDto.name },
    });
    if (existsFlavour) throw new ConflictException('Sabor duplicado');

    const newFlavour = await this.flavourRepository.create(createFlavourDto);
    await this.flavourRepository.save(newFlavour);

    return { message: 'Nuevo Sabor Creado' };
  }

  async findAll() {
    return await this.flavourRepository.find();
  }

  async findOne(id: string) {
    const flavour = await this.getFlavour(id, false);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');
    return flavour;
  }

  async update(id: string, updateFlavourDto: UpdateFlavourDto) {
    const flavour = await this.getFlavour(id, false);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');

    if (updateFlavourDto.name) {
      const duplicate = await this.flavourRepository.findOne({
        where: { name: updateFlavourDto.name },
      });
      if (duplicate) throw new ConflictException('Nombre de sabor duplicado');
    }

    await this.flavourRepository.update(id, { ...updateFlavourDto });
    return { message: `Sabor ${id} actualizado` };
  }

  async remove(id: string) {
    const flavour = await this.getFlavour(id, false);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');
    await this.flavourRepository.remove(flavour);
    return { message: `Sabor #${id} Borrado` };
  }

  async getFlavour(id: string, relation: boolean) {
    const existFlavor = await this.flavourRepository.findOne({
      where: { id: id },
      relations: { products: relation },
    });
    return existFlavor;
  }

  async getFlavourByName(name: string) {
    const existFlavor = await this.flavourRepository.findOne({
      where: { name: name },
    });
    return existFlavor;
  }
}
