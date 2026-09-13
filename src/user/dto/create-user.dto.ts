import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {
  @IsString({ message: 'Name precisa ser do tipo String' })
  @IsNotEmpty({ message: 'Name não pode estar vazio' })
  name!: string

  @IsEmail({}, { message: 'Email precisa ser válido' })
  email!: string

  @IsString({ message: 'Password precisar ser do tipo String' })
  @IsNotEmpty({ message: 'Password não pode estar vazio' })
  @MinLength(6, { message: 'Password precisa ter no mínimo 6 caracteres' })
  password!: string
}
