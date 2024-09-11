import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @Transform(({ value }) => value.toString().toLowerCase())
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚ,\.¡!-]*$/, {
    message:
      'El nombre solo puede contener solo letras, números, comas y espacios',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚ,\.()¿?¡!-]+$/, {
    message:
      'Descripcion del producto debe contener solo letras, números, comas y espacios',
  })
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'false';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  state: boolean;

  @IsOptional()
  @Transform(({ value }) => value.toString().toLowerCase())
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9 ,]+$/, {
    message: 'Sabor debe contener solo letras, números, comas y espacios',
  })
  flavourName: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toString().toLowerCase())
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9 ,]+$/, {
    message: 'Categoria debe contener solo letras, números, comas y espacios',
  })
  categoryName: string;
}
