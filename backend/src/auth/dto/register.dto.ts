import { IsEmail, IsString, IsNumber, IsDateString } from 'class-validator';

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

  @IsNumber()
  IDRoles: number;

  @IsNumber()
  IDJob_title: number;
}
