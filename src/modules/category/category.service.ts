import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const existsCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existsCategory) throw new ConflictException('Categoria Existente!');

    const newCategory = await this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(newCategory);

    return { message: 'Categoria Creada' };
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    const existsCategory = await this.getCategory(id, false);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');
    return existsCategory;
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto) {
    const existsCategory = await this.getCategory(id, false);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');

    if (updateCategoryDto.name) {
      const duplicate = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (duplicate)
        throw new ConflictException('Nombre de categoria duplicado');
    }

    await this.categoryRepository.update(id, { ...updateCategoryDto });
    return { message: `Categoria ${id} actualizada` };
  }

  async remove(id: string) {
    const existsCategory = await this.getCategory(id, true);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');
    await this.categoryRepository.remove(existsCategory);
    return { message: `Categoria #${id} Eliminada` };
  }

  async getCategory(id: string, relation: boolean) {
    const existsCategory = await this.categoryRepository.findOne({
      where: { id: id },
      relations: { products: relation },
    });
    return existsCategory;
  }

  async getCategoryByName(name: string) {
    const existsCategory = await this.categoryRepository.findOne({
      where: { name: name },
    });
    return existsCategory;
  }
}
