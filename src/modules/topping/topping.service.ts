import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from './entities/topping.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ToppingService {

  constructor(
    @InjectRepository(Topping)
    private toppingRepository: Repository<Topping>,
  ) {}

  async create(createToppingDto: CreateToppingDto) {
    const existTopping = await this.toppingRepository.findOne({
      where: { name: createToppingDto.name },
    });
    if (existTopping) throw new ConflictException('Ya existe un Topping con ese nombre');

    const newTopping = this.toppingRepository.create({
      name: createToppingDto.name,
      state: createToppingDto.state
    });
    const toppingSaved = await this.toppingRepository.save(newTopping);

    const message = { message: `Topping ${toppingSaved.name} creado correctamente`};
    return message;
  }


  async findAll() {
    return await this.toppingRepository.find();
  }

  async findOne(id: string) {
    const topping = await this.toppingRepository.findOneBy({id});
    if (!topping) throw new NotFoundException('Topping no encontrado');
    return topping;
  }

  async update(id: string, updateToppingDto: UpdateToppingDto) {
    if (updateToppingDto.name) {
      const duplicate = await this.toppingRepository.findOne({
        where: { name: updateToppingDto.name },
      });
      if (duplicate) throw new ConflictException('Ya existe un Topping con ese nombre');
    }
    await this.findOne(id);

    await this.toppingRepository.update(id, { ...updateToppingDto });
    const toppingName = updateToppingDto.name;

    const message = { message: `Topping ${toppingName} actualizado correctamente`};
    return message;
  }

  async remove(id: string) {
    const topping = await this.findOne(id);
    await this.toppingRepository.remove(topping);

    const message = { message: `Topping ${topping.name} eliminado correctamente`};
    return message;
  }
}
