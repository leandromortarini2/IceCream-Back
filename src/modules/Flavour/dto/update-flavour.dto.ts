import { PartialType } from '@nestjs/swagger';
import { CreateFlavourDto } from './create-flavour.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFlavourDto extends PartialType(CreateFlavourDto) {
  @IsBoolean()
  @IsOptional()
  state?: boolean;
}
