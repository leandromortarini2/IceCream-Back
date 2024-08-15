import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @IsString()
  flavourId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
