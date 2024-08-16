import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FlavourModule } from '../Flavour/flavour.module';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { FileUpload } from '../cloudinary/fileUpload.cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, FlavourModule],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryConfig, FileUpload],
})
export class ProductModule {}
