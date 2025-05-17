import { Injectable } from "@nestjs/common";
import { BibliotecaRepository } from "./biblioteca.repository";
import { BibliotecaDto, CreateBibliotecaDto, UpdateBibliotecaDto, BibliotecaWithLibrosDto } from "./dto";
import { Service } from "../shared/service.interface";
import { BibliotecaMapper } from "./mapper/biblioteca.mapper";
import { LibroRepository } from "../libro/libro.repository";
import { LibroDto, CreateLibroDto, UpdateLibroDto } from "../libro/dto";
import { LibroMapper } from "../libro/mapper/libro.mapper";
import { BusinessError, BusinessErrorType } from "../shared/business-error";

@Injectable()
export class BibliotecaService implements Service<BibliotecaDto> {
    constructor(
        private readonly bibliotecaRepository: BibliotecaRepository,
        private readonly libroRepository: LibroRepository
    ) {}

    async findAll(): Promise<BibliotecaDto[]> {
        const entities = await this.bibliotecaRepository.findAll();
        return BibliotecaMapper.toDtoList(entities);
    }

    async findOne(id: string): Promise<BibliotecaDto> {
        const entity = await this.bibliotecaRepository.findOne(id);

        if (!entity) {
            throw new BusinessError(`Biblioteca with id ${id} not found`, BusinessErrorType.NOT_FOUND);
        }

        return BibliotecaMapper.toDto(entity);
    }

    async create(createBibliotecaDto: CreateBibliotecaDto): Promise<BibliotecaDto> {
        // Validar que la hora de apertura sea menor que la hora de cierre
        const horaApertura = new Date(`1970-01-01T${createBibliotecaDto.horaApertura}`);
        const horaCierre = new Date(`1970-01-01T${createBibliotecaDto.horaCierre}`);
        if (horaApertura >= horaCierre) {
            throw new BusinessError(
                'La hora de apertura debe ser menor que la hora de cierre',
                BusinessErrorType.PRECONDITION_FAILED
            );
        }

        // Map DTO to entity
        const entity = BibliotecaMapper.toEntityFromCreate(createBibliotecaDto);
        
        // Create entity
        const savedEntity = await this.bibliotecaRepository.create(entity);
        
        // Map saved entity back to DTO
        return BibliotecaMapper.toDto(savedEntity);
    }

    async update(id: string, updateBibliotecaDto: UpdateBibliotecaDto): Promise<BibliotecaDto> {
        if (updateBibliotecaDto.horaApertura && updateBibliotecaDto.horaCierre) {
            const horaApertura = new Date(`1970-01-01T${updateBibliotecaDto.horaApertura}`);
            const horaCierre = new Date(`1970-01-01T${updateBibliotecaDto.horaCierre}`);
            if (horaApertura >= horaCierre) {
                throw new BusinessError(
                    'La hora de apertura debe ser menor que la hora de cierre',
                    BusinessErrorType.PRECONDITION_FAILED
                );
            }
        }
        else if (updateBibliotecaDto.horaApertura || updateBibliotecaDto.horaCierre) {
            const existingEntity = await this.bibliotecaRepository.findOne(id);
            if (!existingEntity) {
                throw new BusinessError(
                    `Biblioteca with id ${id} not found`,
                    BusinessErrorType.NOT_FOUND
                );
            }
            const horaApertura = new Date(`1970-01-01T${updateBibliotecaDto.horaApertura || existingEntity.horaApertura}`);
            const horaCierre = new Date(`1970-01-01T${updateBibliotecaDto.horaCierre || existingEntity.horaCierre}`);
            if (horaApertura >= horaCierre) {
                throw new BusinessError(
                    'La hora de apertura debe ser menor que la hora de cierre',
                    BusinessErrorType.PRECONDITION_FAILED
                );
            }
        }

        const entity = BibliotecaMapper.toEntityFromUpdate(updateBibliotecaDto);
        const updatedEntity = await this.bibliotecaRepository.update(id, entity);
        if (!updatedEntity) {
            throw new BusinessError(
                `Biblioteca with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
        return BibliotecaMapper.toDto(updatedEntity);
    }

    async delete(id: string): Promise<void> {
        const entity = await this.bibliotecaRepository.findOne(id);
        if (!entity) {
            throw new BusinessError(
                `Biblioteca with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
        await this.bibliotecaRepository.delete(id);
    }

    async findBibliotecaWithLibros(id: string): Promise<BibliotecaWithLibrosDto> {
        const biblioteca = await this.bibliotecaRepository.findOne(id);
        if (!biblioteca) {
            throw new BusinessError(
                `Biblioteca with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
        const libros = await this.libroRepository.findBooksFromLibrary(id);
        const bibliotecaDto = BibliotecaMapper.toDto(biblioteca);
        const librosDtos = LibroMapper.toDtoList(libros);
        const result = new BibliotecaWithLibrosDto();
        Object.assign(result, bibliotecaDto);
        result.libros = librosDtos;
        return result;
    }

    async addLibroToBiblioteca(id: string, libroDto: LibroDto): Promise<LibroDto> {
        const biblioteca = await this.bibliotecaRepository.findOne(id);
        if (!biblioteca) {
            throw new BusinessError(
                `Biblioteca with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
        const libroEntity = await this.libroRepository.findOne(libroDto.id);
        if (!libroEntity) {
            throw new BusinessError(
                `Libro with id ${libroDto.id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
        if (!libroEntity.bibliotecas?.some(b => b.id === biblioteca.id)) {
            libroEntity.bibliotecas = libroEntity.bibliotecas || [];
            libroEntity.bibliotecas.push(biblioteca);
            const savedLibro = await this.libroRepository.create(libroEntity);
            return LibroMapper.toDto(savedLibro);
        }
        throw new BusinessError(
            'El libro ya está asociado a esta biblioteca',
            BusinessErrorType.PRECONDITION_FAILED
        );
    }

    async findLibroFromBiblioteca(bibliotecaId: string, libroId: string): Promise<LibroDto> {
        try {
            const libro = await this.libroRepository.findBookFromLibrary(libroId, bibliotecaId);
            return LibroMapper.toDto(libro);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${libroId} not found in biblioteca ${bibliotecaId}`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async updateLibroFromBiblioteca(bibliotecaId: string, libroId: string, updateLibroDto: UpdateLibroDto): Promise<LibroDto> {
        try {
            const libroEntity = LibroMapper.toEntityFromUpdate(updateLibroDto);
            const updatedLibro = await this.libroRepository.updateBooksFromLibrary(libroId, libroEntity, bibliotecaId);
            return LibroMapper.toDto(updatedLibro);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${libroId} not found in biblioteca ${bibliotecaId}`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async deleteLibroFromBiblioteca(bibliotecaId: string, libroId: string): Promise<void> {
        try {
            await this.libroRepository.deleteBookFromLibrary(libroId, bibliotecaId);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${libroId} not found in biblioteca ${bibliotecaId}`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }
}
