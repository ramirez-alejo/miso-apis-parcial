import { IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateBibliotecaDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La dirección debe tener máximo 200 caracteres' })
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La ciudad debe tener máximo 50 caracteres' })
  ciudad?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { 
    message: 'La hora de apertura debe tener formato HH:MM:SS' 
  })
  horaApertura?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { 
    message: 'La hora de cierre debe tener formato HH:MM:SS' 
  })
  horaCierre?: string;
}
