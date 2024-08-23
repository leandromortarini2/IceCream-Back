import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UpdateFlavourDto } from './dto/update-flavour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavour } from './entities/flavour.entity';
import { Repository } from 'typeorm';
import * as data from '../../../data/flavour.data.json';

@Injectable()
export class FlavourService implements OnModuleInit {
  constructor(
    @InjectRepository(Flavour) private flavourRepository: Repository<Flavour>,
  ) {}

  async onModuleInit() {
    const flavourFromJson = new Set<string>();
    data.forEach((producto) => flavourFromJson.add(producto.name));
    const flavours = Array.from(flavourFromJson);

    for (const flavourName of flavours) {
      const existFlavor = await this.getFlavourByName(flavourName);
      if (!existFlavor) {
        await this.create(flavourName);
      }
    }
    return 'PreLoad-Flavours';
  }

  async create(flavourName: string) {
    const existsFlavour = await this.flavourRepository.findOne({
      where: { name: flavourName },
    });
    if (existsFlavour) throw new ConflictException('Sabor duplicado');

    const newFlavour = await this.flavourRepository.create({
      name: flavourName,
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
    if (updateFlavourDto.name) {
      const duplicate = await this.flavourRepository.findOne({
        where: { name: updateFlavourDto.name },
      });
      if (duplicate) throw new ConflictException('Nombre de sabor duplicado');
    }
    const flavour = await this.getFlavour(id, false);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');

    await this.flavourRepository.update(id, { ...updateFlavourDto });
    const flavourName = updateFlavourDto.name || flavour.name;
    return { message: `Sabor ${flavourName} actualizado` };
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
