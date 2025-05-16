import { IsNotEmpty, IsString, MaxLength, Matches, MinLength } from 'class-validator';

export class CreateBibliotecaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'La dirección debe tener máximo 200 caracteres' })
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'La ciudad debe tener máximo 50 caracteres' })
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { 
    message: 'La hora de apertura debe tener formato HH:MM:SS' 
  })
  horaApertura: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { 
    message: 'La hora de cierre debe tener formato HH:MM:SS' 
  })
  horaCierre: string;
}
