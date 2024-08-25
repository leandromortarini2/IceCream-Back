import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @Transform(({ value }) => value.toString().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9 ,]+$/, {
    message: 'Categoria debe contener solo letras, números, comas y espacios',
  })
  name: string;
}
