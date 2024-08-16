import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
    const savedCategory = await this.categoryRepository.save(newCategory);

    return { msg: 'Categoria Creada', savedCategory };
  }

  async findAll() {
    return await this.categoryRepository.find({
      relations: { products: true },
    });
  }

  async findOne(id: string) {
    const existsCategory = await this.getCategory(id, true);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');
    return existsCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existsCategory = await this.getCategory(id, true);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');
    await this.categoryRepository.update(id, { ...updateCategoryDto });
    return { msg: `Categoria ${id} actualizada` };
  }

  async remove(id: string) {
    const existsCategory = await this.getCategory(id, true);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');
    await this.categoryRepository.remove(existsCategory);
    return `Categoria #${id} Eliminada`;
  }

  async getCategory(id: string, relation: boolean) {
    const existsCategory = await this.categoryRepository.findOne({
      where: { id: id },
      relations: { products: relation },
    });
    return existsCategory;
  }
}
