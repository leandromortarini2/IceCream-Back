import { PartialType } from '@nestjs/swagger';
import { CreateSalsaDto } from './create-salsa.dto';

export class UpdateSalsaDto extends PartialType(CreateSalsaDto) {}
