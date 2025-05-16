import { IsOptional, IsString, MaxLength, IsISBN, IsDateString } from 'class-validator';

export class UpdateLibroDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El título debe tener máximo 100 caracteres' })
  titulo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El autor debe tener máximo 100 caracteres' })
  autor?: string;

  @IsOptional()
  @IsDateString()
  fechaPublicacion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'El ISBN debe tener máximo 20 caracteres' })
  @IsISBN(undefined, { message: 'El ISBN debe tener un formato válido' })
  isbn?: string;

  @IsOptional()
  bibliotecaId?: string;
}
