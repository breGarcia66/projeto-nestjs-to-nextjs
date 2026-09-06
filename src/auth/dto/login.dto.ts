import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsEmail({}, {message: 'Email inválido'})
  email!: string;

  @IsString({message: 'Password precisa ser uma String'})
  @IsNotEmpty({message: 'Password não pode está vazio'})
  password!: string;
}
