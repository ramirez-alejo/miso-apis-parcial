import { IsNotEmpty, IsString, MaxLength, IsISBN, IsDate, IsDateString } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El título debe tener máximo 100 caracteres' })
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El autor debe tener máximo 100 caracteres' })
  autor: string;

  @IsNotEmpty()
  @IsDateString()
  fechaPublicacion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'El ISBN debe tener máximo 20 caracteres' })
  @IsISBN(undefined, { message: 'El ISBN debe tener un formato válido' })
  isbn: string;

  @IsNotEmpty()
  bibliotecaId: string;
}
