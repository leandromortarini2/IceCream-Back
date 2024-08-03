import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createUserDto {
  @IsNotEmpty({ message: 'Username no debe ser vacio' })
  @IsString({ message: 'Username debe ser un string' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username debe contener solo numeros y letras',
  })
  @MinLength(3, { message: 'Username, longitud de mas de 3 carateres' })
  username: string;

  @IsNotEmpty({ message: 'Password no debe estar vacio' })
  @IsString({ message: 'Password debe ser un string' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message:
        'Password debe contener al menos una letra Mayuscula, una minuscula, un caracter especial, un numero y debe tener una longitud entre 6 a 15 caracteres.',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Nombre no debe estar vacio' })
  @IsString({ message: 'Nombere debe ser un string' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Nombre debe contener solo letras, puede tener espacios',
  })
  @MinLength(3, { message: 'Longitud minima 3 caracteres' })
  @MaxLength(30, { message: 'Longitud maxima 30 characters' })
  name: string;

  @IsNotEmpty({ message: 'Sucursal no debe estar vacia' })
  @IsString({ message: 'Sucursal debe ser un string' })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Sucursal puede conetener numeros,letras y espacios',
  })
  @Length(2, 30, {
    message: 'Sucursal, longitud en 2 a 30 caracteres',
  })
  sucursal: string;

  @IsNotEmpty({ message: 'Email no debe estar vacio' })
  @IsEmail({}, { message: 'Email valido' })
  email: string;

  @IsNotEmpty({ message: 'Phone no debe estar' })
  @IsString({ message: 'Phone debe ser un string' })
  @Matches(/^[0-9]+$/, {
    message: 'Phone contiene solo numeros positivos',
  })
  phone: string;
}
