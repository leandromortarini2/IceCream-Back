import { PartialType } from '@nestjs/swagger';
import { CreateFlavourDto } from './create-flavour.dto';

export class UpdateFlavourDto extends PartialType(CreateFlavourDto) {}
