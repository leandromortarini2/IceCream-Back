import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class loginUserDto {
  @IsString({ message: 'Username debe ser un string' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username debe contener solo numeros y letras',
  })
  @MinLength(3, { message: 'Username, longitud de mas de 3 carateres' })
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsString({ message: 'Password debe ser un string' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message:
        'Password debe contener al menos una letra Mayuscula, una minuscula, un caracter especial, un numero y debe tener una longitud entre 6 a 15 caracteres.',
    },
  )
  password?: string;

  @IsEmail({}, { message: 'Email valido' })
  @IsOptional()
  email?: string;
}
