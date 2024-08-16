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
    const savedFlavour = await this.flavourRepository.save(newFlavour);

    return { msg: 'Nuevo Sabor Creado', savedFlavour };
  }

  async findAll() {
    return await this.flavourRepository.find({ relations: { products: true } });
  }

  async findOne(id: string) {
    const flavour = await this.getFlavour(id, true);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');
    return flavour;
  }

  async update(id: string, updateFlavourDto: UpdateFlavourDto) {
    const flavour = await this.getFlavour(id, true);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');
    await this.flavourRepository.update(id, { ...updateFlavourDto });
    return { msg: `Sabor ${id} actualizado` };
  }

  async remove(id: string) {
    const flavour = await this.getFlavour(id, true);
    if (!flavour) throw new NotFoundException('Sabor no encontrado');
    await this.flavourRepository.remove(flavour);
    return `Sabor #${id} Borrado`;
  }

  async getFlavour(id: string, relation: boolean) {
    const existFlavor = await this.flavourRepository.findOne({
      where: { id: id },
      relations: { products: relation },
    });
    return existFlavor;
  }
}
