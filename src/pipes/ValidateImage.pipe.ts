import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { request } from 'express';

@Injectable()
export class ValidateImage implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == null) return value;
    const minSize = 1000;

    if (value.size < minSize) {
      throw new BadRequestException('Archivo debe ser mayor a 1Kb');
    }

    if (
      value.mimetype &&
      !Object.values(ImageType).includes(value.mimetype as ImageType)
    ) {
      throw new BadRequestException(
        'Archivo debe ser tipo .webp, .png, .jpg, .jpeg',
      );
    }

    return value;
  }
}

enum ImageType {
  webp = 'image/webp',
  png = 'image/png',
  jpg = 'image/jpg',
  jpeg = 'image/jpeg',
}
