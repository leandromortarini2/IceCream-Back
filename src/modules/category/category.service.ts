import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import * as data from '../../../data/category.data.json';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    const categoryFromJson = new Set<string>();
    data.forEach((category) =>
      categoryFromJson.add(category.name.toLowerCase()),
    );
    const categories = Array.from(categoryFromJson);

    const existingCategories = await this.getCategoriesByNames(categories);

    const categoriesToCreate = categories.filter(
      (categoryName) => !existingCategories.includes(categoryName),
    );

    if (categoriesToCreate.length > 0) {
      await this.createCategoriesInBatch(categoriesToCreate);
    }

    return 'PreLoad-Categories';
  }

  async getCategoriesByNames(names: string[]): Promise<string[]> {
    const categories = await this.categoryRepository.find({
      where: {
        name: In(names),
      },
    });

    return categories.map((category) => category.name);
  }

  async createCategoriesInBatch(categories: string[]): Promise<void> {
    const categoryEntities = categories.map((name) => ({ name }));
    const categoriesNames =
      await this.categoryRepository.create(categoryEntities);
    await this.categoryRepository.save(categoriesNames);
  }

  async create(categoryName: string) {
    const existsCategory = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (existsCategory) throw new ConflictException('Categoria Existente!');

    const newCategory = await this.categoryRepository.create({
      name: categoryName,
    });
    const savedCategory = await this.categoryRepository.save(newCategory);
    return savedCategory;
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
    if (updateCategoryDto.name) {
      const duplicate = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (duplicate)
        throw new ConflictException('Nombre de categoria duplicado');
    }
    const existsCategory = await this.getCategory(id, false);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');

    await this.categoryRepository.update(id, { ...updateCategoryDto });
    const categoryName = updateCategoryDto.name || existsCategory.name;
    return {
      message: `Categoria ${categoryName} actualizada`,
    };
  }

  async remove(id: string) {
    const existsCategory = await this.getCategory(id, true);
    if (!existsCategory) throw new NotFoundException('Categoria no existe!');
    await this.categoryRepository.remove(existsCategory);
    return { message: `Categoria ${existsCategory.name} Eliminada` };
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
