import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FlavourService } from '../Flavour/flavour.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private flavourService: FlavourService,
    private categoryService: CategoryService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.getCategory(
      createProductDto.categoryId,
    );
    if (!category) throw new NotFoundException('Categoria no existe!');
    const flavour = await this.flavourService.getFlavour(
      createProductDto.flavourId,
    );
    if (!flavour) throw new NotFoundException('Sabor no existe!');

    const existsNameProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (existsNameProduct)
      throw new ConflictException('Nombre de producto duplicado');

    const newProduct = await this.productRepository.create({
      ...createProductDto,
      flavour,
      category,
    });
    const savedProduct = await this.productRepository.save(newProduct);
    return { msg: 'Producto Creado!', savedProduct };
  }

  async findAll() {
    return await this.productRepository.find({
      relations: { category: true, flavour: true },
    });
  }

  async findOne(id: string) {
    const existsProduct = await this.getProduct(id);
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');
    return existsProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existsProduct = await this.getProduct(id);
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');
    await this.productRepository.update(id, { ...updateProductDto });
    return { msg: `Producto #${id} actualizado` };
  }

  async remove(id: string) {
    const existsProduct = await this.getProduct(id);
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');
    await this.productRepository.remove(existsProduct);
    return `Producto #${id} eliminado`;
  }
  async getProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: { category: true, flavour: true },
    });
    return product;
  }
}
