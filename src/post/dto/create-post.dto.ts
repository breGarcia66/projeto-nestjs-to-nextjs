import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Título precisa ser uma string' })
  @Length(10, 150, { message: 'Título precisa ter de 10 a 150 caracteres' })
  title!: string;

  @IsString({ message: 'Excerto precisa ser uma string' })
  @Length(10, 200, { message: 'Excerto precisa ter de 10 a 200 caracteres' })
  excerpt!: string;

  @IsString({ message: 'O conteúdo precisa ser uma string' })
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
  content!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;
}
