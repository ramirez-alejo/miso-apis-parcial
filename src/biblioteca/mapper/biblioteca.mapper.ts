import { BibliotecaDto, CreateBibliotecaDto, UpdateBibliotecaDto } from '../dto';
import { BibliotecaEntity } from '../biblioteca.entity';

export class BibliotecaMapper {

  static toDto(entity: BibliotecaEntity): BibliotecaDto {
    const dto = new BibliotecaDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.direccion = entity.direccion;
    dto.ciudad = entity.ciudad;
    dto.horaApertura = entity.horaApertura;
    dto.horaCierre = entity.horaCierre;
    return dto;
  }


  static toEntityFromCreate(dto: CreateBibliotecaDto): BibliotecaEntity {
    const entity = new BibliotecaEntity();
    entity.nombre = dto.nombre;
    entity.direccion = dto.direccion;
    entity.ciudad = dto.ciudad;
    entity.horaApertura = dto.horaApertura;
    entity.horaCierre = dto.horaCierre;
    entity.libros = [];
    return entity;
  }


  static toEntityFromUpdate(dto: UpdateBibliotecaDto): Partial<BibliotecaEntity> {
    const entity = new BibliotecaEntity();
    if (dto.nombre !== undefined) entity.nombre = dto.nombre;
    if (dto.direccion !== undefined) entity.direccion = dto.direccion;
    if (dto.ciudad !== undefined) entity.ciudad = dto.ciudad;
    if (dto.horaApertura !== undefined) entity.horaApertura = dto.horaApertura;
    if (dto.horaCierre !== undefined) entity.horaCierre = dto.horaCierre;
    return entity;
  }


  static toDtoList(entities: BibliotecaEntity[]): BibliotecaDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
