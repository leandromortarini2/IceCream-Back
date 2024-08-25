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
import { Category } from '../category/entities/category.entity';
import { Flavour } from '../Flavour/entities/flavour.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private flavourService: FlavourService,
    private categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async create(createProductDto: CreateProductDto, image: Express.Multer.File) {
    let category = await this.categoryService.getCategoryByName(
      createProductDto.categoryName,
    );

    if (!category) {
      category = await this.categoryService.create(
        createProductDto.categoryName,
      );
    }

    if (!category) {
      throw new NotFoundException('No se pudo crear o encontrar la categoría');
    }

    let flavour = await this.flavourService.getFlavourByName(
      createProductDto.flavourName,
    );
    
    if (!flavour && flavour !== null) {
      flavour = await this.flavourService.create(createProductDto.flavourName);
    }

    if (!flavour && flavour !== null) {
      throw new NotFoundException('No se pudo crear o encontrar el sabor');
    }

    const existsNameProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (existsNameProduct)
      throw new ConflictException('Nombre de producto duplicado');

    let imgUrl: string;
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
      where: { id: id },
      relations: { category: true, flavour: true },
    });
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');
    return existsProduct;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    const existsProduct = await this.getProduct(id);
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');

    let category: Category;
    if (updateProductDto.categoryName) {
      const existCategory = await this.categoryService.getCategoryByName(
        updateProductDto.categoryName,
      );
      if (!existCategory) throw new NotFoundException('Categoria no existe');
      category = existCategory;
    }

    let flavour: Flavour;
    if (updateProductDto.flavourName) {
      const existFlavour = await this.flavourService.getFlavourByName(
        updateProductDto.flavourName,
      );
      if (!existFlavour) throw new NotFoundException('Sabor no existe');
      flavour = existFlavour;
    }

    if (updateProductDto.name && updateProductDto.name !== existsProduct.name) {
      const duplicate = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });

      if (duplicate) {
        throw new ConflictException('Nombre de producto duplicado');
      }
    }

    let imgUrl = existsProduct.image;
    if (image) {
      //*Extrar id img para eliminarla en cloudinary
      const defaultImageUrl = process.env.IMAGE_DEFAULT;
      if (existsProduct.image !== defaultImageUrl) {
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

    const updateData: Partial<Product> = {
      name: updateProductDto.name || existsProduct.name,
      description: updateProductDto.description || existsProduct.description,
      price:
        updateProductDto.price !== undefined
          ? updateProductDto.price
          : existsProduct.price,
      state:
        updateProductDto.state !== undefined
          ? updateProductDto.state
          : existsProduct.state,
      category,
      flavour,
      image: imgUrl,
    };

    await this.productRepository.update(id, updateData);

    const productName = updateProductDto.name || existsProduct.name;
    return { msg: `Producto ${productName} actualizado` };
  }

  async remove(id: string) {
    const existsProduct = await this.getProduct(id);
    if (!existsProduct) throw new NotFoundException('Producto no encontrado');

    //*Extrar id img para eliminarla en cloudinary
    const publicId = extractPublicIdFromUrl(existsProduct.image);
    await this.cloudinaryService.deleteImage(publicId);

    await this.productRepository.remove(existsProduct);
    return { message: `Producto ${existsProduct.name} eliminado` };
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: { category: true, flavour: true },
    });
    return product;
  }
}
