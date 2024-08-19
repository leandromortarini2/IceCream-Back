import {
  ConflictException,
  HttpException,
  HttpStatus,
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { extractPublicIdFromUrl } from 'src/utils/extractPublicId.utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private flavourService: FlavourService,
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(createProductDto: CreateProductDto, image) {
    const category = await this.categoryService.getCategoryByName(
      createProductDto.name,
    );
    if (!category) throw new NotFoundException('Categoria no existe!');
    const flavour = await this.flavourService.getFlavourByName(
      createProductDto.flavourName,
    );
    if (!flavour) throw new NotFoundException('Sabor no existe!');

    const existsNameProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (existsNameProduct)
      throw new ConflictException('Nombre de producto duplicado');

    let imgUrl = null;
    if (image) {
      const imgUpload = await this.cloudinaryService.uploadImg(image);
      if (!imgUpload) {
        throw new HttpException(
          'Error al subir la imagen',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      imgUrl = imgUpload.url;
    }

    const newProduct = await this.productRepository.create({
      ...createProductDto,
      image: imgUrl,
      flavour,
      category,
    });
    await this.productRepository.save(newProduct);
    return { message: 'Producto Creado!' };
  }

  async findAll() {
    return await this.productRepository.find({
      relations: { category: true, flavour: true },
    });
  }

  async findOne(id: string) {
    const existsProduct = await this.productRepository.findOne({
      where: { id:id },
      relations: { category: true, flavour: true },
    });
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');
    return existsProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto, image) {
    if (updateProductDto.name) {
      const duplicate = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });

      if (duplicate) {
        throw new ConflictException('Nombre de producto duplicado');
      }
    }

     const existsProduct = await this.getProduct(id);
     if (!existsProduct) throw new NotFoundException('Producto no encontrado');

    let imgUrl = existsProduct.image;
    if (image) {
      //*Extrar id img para eliminarla en cloudinary
      if (existsProduct.image !== null) {
        const publicId = extractPublicIdFromUrl(existsProduct.image);
        await this.cloudinaryService.deleteImage(publicId);
      }

      const imgUpload = await this.cloudinaryService.uploadImg(image);
      if (!imgUpload) {
        throw new HttpException(
          'Error al subir la imagen',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      imgUrl = imgUpload.url;
    }

    await this.productRepository.update(id, {
      ...updateProductDto,
      image: imgUrl,
    });

    const productName = updateProductDto.name || existsProduct.name
    return { msg: `Producto ${productName} actualizado` };
  }

  async remove(id: string) {
    const existsProduct = await this.getProduct(id);
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');

    //*Extrar id img para eliminarla en cloudinary
    const publicId = extractPublicIdFromUrl(existsProduct.image);
    await this.cloudinaryService.deleteImage(publicId);

    await this.productRepository.remove(existsProduct);
    return { message: `Producto #${id} eliminado` };
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: { category: true, flavour: true },
    });
    return product;
  }
}
