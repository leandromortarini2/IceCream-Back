import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFlavourDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}
