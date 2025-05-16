import { LibroDto } from './libro.dto';
import { BibliotecaDto } from '../../biblioteca/dto/biblioteca.dto';

export class LibroWithBibliotecaDto extends LibroDto {
  biblioteca: BibliotecaDto;
}
