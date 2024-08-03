import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createUserDto {
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsString({ message: 'Username must be a string' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 8 and 15 characters long',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(30, { message: 'Name must be no longer than 30 characters' })
  name: string;

  @IsNotEmpty({ message: 'Sucursal should not be empty' })
  @IsString({ message: 'Sucursal must be a string' })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Sucursal must contain only letters, numbers, and spaces',
  })
  @Length(2, 30, {
    message: 'Sucursal must be between 2 and 30 characters long',
  })
  sucursal: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Phone should not be empty' })
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^[0-9]+$/, {
    message: 'Phone must contain only numbers and be positive',
  })
  phone: string;
}
