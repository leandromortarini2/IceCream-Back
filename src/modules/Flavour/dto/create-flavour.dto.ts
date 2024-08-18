import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateFlavourDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9 ]+$/, { message: 'Solo letras y números' })
  name: string;
}
