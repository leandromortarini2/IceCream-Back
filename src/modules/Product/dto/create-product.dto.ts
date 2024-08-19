import { Transform, Type } from 'class-transformer';
import {
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
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9 ]*$/, {
    message: 'El nombre solo puede contener letras, números',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  @Matches(/^[a-zA-Z0-9 ]*$/, {
    message: 'Descripcion del producto',
  })
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  stock: number;

  @IsNotEmpty()
  @IsString()
  flavourName: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;
}
