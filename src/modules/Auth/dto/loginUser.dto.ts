import { IsOptional, IsString } from 'class-validator';

export class loginUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
