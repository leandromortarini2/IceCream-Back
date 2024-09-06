import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImage } from 'src/pipes/ValidateImage.pipe';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '../Users/entity/users.entity';
import { TokenGuard } from 'src/guards/token.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidateImage)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 300000,
            message: 'Archivo debe ser menor a 300Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg)|(jpeg)|(png)|(webp)$/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.productService.create(createProductDto, image);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') name: string) {
    return this.productService.findOne(name);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(ValidateImage)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 300000,
            message: 'Archivo debe ser menor a 300Kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg)|(jpeg)|(png)|(webp)$/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.productService.update(id, updateProductDto, image);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(TokenGuard, RoleGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
