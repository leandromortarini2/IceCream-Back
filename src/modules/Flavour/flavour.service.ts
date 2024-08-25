import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFlavourDto } from './dto/update-flavour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavour } from './entities/flavour.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlavourService {
  constructor(
    @InjectRepository(Flavour) private flavourRepository: Repository<Flavour>,
  ) {}

  async create(input: string | UpdateFlavourDto) {

    const flavourName = typeof input === 'string' ? input : input.name;
    const state = typeof input === 'string' ? undefined : input.state;

    const existsFlavour = await this.flavourRepository.findOne({
      where: { name: flavourName },
    });
    if (existsFlavour) throw new ConflictException('Sabor duplicado');

    const newFlavour = this.flavourRepository.create({
      name: flavourName,
      state: state
    });
    const savedFlavour = await this.flavourRepository.save(newFlavour);
    return savedFlavour;
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


    if (updateFlavourDto.name && updateFlavourDto.name !== flavour.name) {
      const duplicate = await this.flavourRepository.findOne({
        where: { name: updateFlavourDto.name },
      });
      if (duplicate) throw new ConflictException('Nombre de sabor duplicado');
    }

    await this.flavourRepository.update(id, { ...updateFlavourDto });
    const flavourName = updateFlavourDto.name || flavour.name;
    return { message: `Sabor ${flavourName} actualizado` };
  }

  async remove(id: string) {
    const flavour = await this.getFlavour(id, false);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');
    await this.flavourRepository.remove(flavour);
    return { message: `Sabor ${flavour.name} eliminado con éxito` };
  }

  async getFlavour(id: string, relation: boolean) {
    const existFlavor = await this.flavourRepository.findOne({
      where: { id: id },
      relations: { products: relation },
    });
    return existFlavor;
  }

  async getFlavourByName(name: string) {

    if (!name) return null;

    const existFlavor = await this.flavourRepository.findOne({
      where: { name: name },
    });
    return existFlavor;
  }
}
