import { IsEmail, IsString, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  FIO: string;

  @IsEmail()
  Email: string;

  @IsString()
  Password: string;

  @IsString()
  Phone: string;

  @IsDateString()
  BirthDate: string;
}
