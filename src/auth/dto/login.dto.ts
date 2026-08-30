import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsString({ message: 'Nome de usuário precisar ser uma String' })
  @Length(5, 150, { message: 'Nome de usuário pequeno de mais' })
  username!: string;
  
  @IsEmail({}, {message: 'Email inválido'})
  email!: string;

  @IsString({message: 'Password precisa ser uma String'})
  @IsNotEmpty({message: 'Password não pode está vazio'})
  password!: string;
}