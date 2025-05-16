import { BibliotecaDto } from './biblioteca.dto';
import { LibroDto } from '../../libro/dto/libro.dto';

export class BibliotecaWithLibrosDto extends BibliotecaDto {
  libros: LibroDto[];
}
