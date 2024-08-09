import { IsNotEmpty, IsString } from 'class-validator';

export class loginUserDto {
  @IsString({ message: 'Usuario id Clerk' })
  @IsNotEmpty()
  user_id: string;
}
