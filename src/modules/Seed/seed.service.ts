import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Category } from '../category/entities/category.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavour } from '../Flavour/entities/flavour.entity';
import * as seedFlavours from '../../../data/flavour.data.json';
import * as seedCategories from '../../../data/category.data.json';
import { SeedData } from 'interfaces/data.interfaces';
import { Role, User } from '../Users/entity/users.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Flavour)
    private flavourRepository: Repository<Flavour>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async onModuleInit() {
    try {
      await this.seedFlavours();
      Logger.log(
        'Sabores precargados exitosamente.',
        'PreloadData - Heladeria "Ice Cream"',
      );
      await this.seedCategories();
      Logger.log(
        'Categorias precargadas exitosamente.',
        'PreloadData - Heladeria "Ice Cream"',
      );

      await this.createAdminUser();
      Logger.log(
        'Usuario Admin cargado exitosamente.',
        'PreloadData - Heladeria "Ice Cream"',
      );

    } catch (error) {
      console.error('Error en la precarga de datos:', error);
    }
  }

  async seedFlavours() {
    await this.seedEntities(seedFlavours, this.flavourRepository, 'name');
  }

  async seedCategories() {
    await this.seedEntities(seedCategories, this.categoryRepository, 'name');
  }

  private async seedEntities(
    seedData: SeedData[],
    repository: Repository<Flavour | Category>,
    nameField: string,
  ): Promise<void> {
    const namesSet = new Set<string>();
    seedData.forEach((item) => namesSet.add(item[nameField].toLowerCase()));
    const names = Array.from(namesSet);

    const existingEntities = await this.getEntitiesByNames(
      repository,
      names,
      nameField,
    );
    const entitiesToCreate = names.filter(
      (name) => !existingEntities.includes(name),
    );

    if (entitiesToCreate.length > 0) {
      await this.createEntitiesInBatch(repository, entitiesToCreate, nameField);
    }
  }

  private async getEntitiesByNames(
    repository: Repository<any>,
    names: string[],
    nameField: string,
  ): Promise<string[]> {
    const entities = await repository.find({
      where: {
        [nameField]: In(names),
      },
    });

    return entities.map((entity) => entity[nameField]);
  }

  private async createEntitiesInBatch(
    repository: Repository<any>,
    names: string[],
    nameField: string,
  ): Promise<void> {
    const entityObjects = names.map((name) => {

      if (repository.target === Flavour) {
        return { [nameField]: name, state: true };
      }

      return { [nameField]: name };
    });

    const entities = repository.create(entityObjects);
    await repository.save(entities);
  }

  private async createAdminUser () {
    const userAdmin = await this.userRepository.findOneBy({
      email: process.env.EMAIL_ADMIN,
    });

    if (!userAdmin) {
      const createUserAdmin = this.userRepository.create({
        name: process.env.NAME_ADMIN,
        lastName: process.env.LAST_NAME_ADMIN,
        email: process.env.EMAIL_ADMIN,
        validate: true,
        role: Role.ADMIN,
        lastLogin: new Date(),
      });
      await this.userRepository.save(createUserAdmin);
    }
    
  };
}
