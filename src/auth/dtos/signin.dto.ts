import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  password?: string;
}
