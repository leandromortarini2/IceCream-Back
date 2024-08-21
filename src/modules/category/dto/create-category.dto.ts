import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9 ]+$/, { message: 'Solo letras, números y espacios' })
  name: string;
}
