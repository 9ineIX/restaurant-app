import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  FIO: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEmail()
  @Transform(({ value, obj }) => value ?? obj.email)
  Email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  @Transform(({ value, obj }) => value ?? obj.password)
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
