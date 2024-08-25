import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSalsaDto } from './dto/create-salsa.dto';
import { UpdateSalsaDto } from './dto/update-salsa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Salsa } from './entities/salsa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalsasService {

  constructor(
    @InjectRepository(Salsa)
    private salsaRepository: Repository<Salsa>,
  ) {}

  async create(createSalsaDto: CreateSalsaDto) {
    const existSalsa = await this.salsaRepository.findOne({
      where: { name: createSalsaDto.name },
    });
    if (existSalsa) throw new ConflictException('Ya existe una Salsa con ese nombre');

    const newSalsa = this.salsaRepository.create({
      name: createSalsaDto.name,
      state: createSalsaDto.state
    });
    const toppingSaved = await this.salsaRepository.save(newSalsa);

    const message = { message: `Salsa ${toppingSaved.name} creada correctamente`};
    return message;
  }

  async findAll() {
    return await this.salsaRepository.find();
  }

  async findOne(id: string) {
    const salsa = await this.salsaRepository.findOneBy({id});
    if (!salsa) throw new NotFoundException('Salsa no encontrada');
    return salsa;
  }

  async update(id: string, updateSalsaDto: UpdateSalsaDto) {
    
    const existSalsa = await this.findOne(id);

    if (updateSalsaDto.name && existSalsa.name !== updateSalsaDto.name) {
      const duplicate = await this.salsaRepository.findOne({
        where: { name: updateSalsaDto.name },
      });
      if (duplicate) throw new ConflictException('Ya existe una Salsa con ese nombre');
    }

    await this.salsaRepository.update(id, { ...updateSalsaDto });
    const SalsaName = updateSalsaDto.name;

    const message = { message: `Salsa de ${SalsaName} actualizada correctamente`};
    return message;
  }

  async remove(id: string) {
    const salsa = await this.findOne(id);
    await this.salsaRepository.remove(salsa);

    const message = { message: `Salsa de ${salsa.name} eliminada correctamente`};
    return message;
  }
}
