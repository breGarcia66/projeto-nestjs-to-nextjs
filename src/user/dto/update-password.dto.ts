import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Password precisa ser uma String' })
  @IsNotEmpty({ message: 'Password não pode está vazio' })
  currentPassword!: string;

  @IsString({ message: 'Novo password precisar ser do tipo String' })
  @IsNotEmpty({ message: 'Novo password não pode estar vazio' })
  @MinLength(6, { message: 'Novo password precisa ter no mínimo 6 caracteres' })
  newPassword!: string;
}
