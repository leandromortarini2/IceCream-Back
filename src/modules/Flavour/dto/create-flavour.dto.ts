import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateFlavourDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z]+$/, { message: 'Solo Letras' })
  name: string;
}
