import { LibroDto, CreateLibroDto, UpdateLibroDto } from '../dto';
import { LibroEntity } from '../libro.entity';

export class LibroMapper {
  /**
   * Maps a LibroEntity to a LibroDto
   */
  static toDto(entity: LibroEntity): LibroDto {
    const dto = new LibroDto();
    dto.id = entity.id;
    dto.titulo = entity.titulo;
    dto.autor = entity.autor;
    dto.fechaPublicacion = entity.fechaPublicacion;
    dto.isbn = entity.isbn;
    return dto;
  }

  /**
   * Maps a CreateLibroDto to a LibroEntity
   */
  static toEntityFromCreate(dto: CreateLibroDto): LibroEntity {
    const entity = new LibroEntity();
    entity.titulo = dto.titulo;
    entity.autor = dto.autor;
    entity.fechaPublicacion = new Date(dto.fechaPublicacion);
    entity.isbn = dto.isbn;
    entity.bibliotecas = [];
    return entity;
  }


  static toEntityFromUpdate(dto: UpdateLibroDto): Partial<LibroEntity> {
    const entity = {} as Partial<LibroEntity>;
    if (dto.titulo !== undefined) entity.titulo = dto.titulo;
    if (dto.autor !== undefined) entity.autor = dto.autor;
    if (dto.fechaPublicacion !== undefined) entity.fechaPublicacion = new Date(dto.fechaPublicacion);
    if (dto.isbn !== undefined) entity.isbn = dto.isbn;
    return entity;
  }


  static toDtoList(entities: LibroEntity[]): LibroDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
