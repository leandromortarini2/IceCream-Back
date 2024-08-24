import { Injectable, OnModuleInit } from '@nestjs/common';
import { FlavourService } from '../Flavour/flavour.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private flavourService: FlavourService,
    private categoryService: CategoryService,
  ) {}
  async onModuleInit() {
    try {
      await this.flavourService.seedFlavours();
      console.log('Sabores precargados exitosamente.');
    } catch (error) {
      console.error('Error al precargar sabores:', error);
    }

    try {
      await this.categoryService.seedCategories();
      console.log('Categorías precargadas exitosamente.');
    } catch (error) {
      console.error('Error al precargar categorías:', error);
    }
  }
}
