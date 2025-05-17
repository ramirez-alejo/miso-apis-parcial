import { Injectable } from "@nestjs/common";
import { LibroRepository } from "./libro.repository";
import { LibroDto, CreateLibroDto, UpdateLibroDto } from "./dto";
import { Service } from "../shared/service.interface";
import { LibroMapper } from "./mapper/libro.mapper";
import { BibliotecaRepository } from "../biblioteca/biblioteca.repository";
import { BusinessError, BusinessErrorType } from "../shared/business-error";

@Injectable()
export class LibroService implements Service<LibroDto> {
    constructor(
        private readonly libroRepository: LibroRepository,
        private readonly bibliotecaRepository: BibliotecaRepository
    ) {}

    async findAll(): Promise<LibroDto[]> {
        const entities = await this.libroRepository.findAll();
        return LibroMapper.toDtoList(entities);
    }

    async findOne(id: string): Promise<LibroDto> {
        try {
            const entity = await this.libroRepository.findOne(id);
            return LibroMapper.toDto(entity);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async create(createLibroDto: CreateLibroDto): Promise<LibroDto> {

        // Validar que la fecha  de publicación sea menor o igual a la fecha actual
        const fechaPublicacion = new Date(createLibroDto.fechaPublicacion);
        const fechaActual = new Date();
        if (fechaPublicacion > fechaActual) {
            throw new BusinessError(
                'La fecha de publicación no puede ser mayor a la fecha actual',
                BusinessErrorType.PRECONDITION_FAILED
            );
        }

        const entity = LibroMapper.toEntityFromCreate(createLibroDto);
        
        if (createLibroDto.bibliotecaId) {
            try {
                const biblioteca = await this.bibliotecaRepository.findOne(createLibroDto.bibliotecaId);
                entity.bibliotecas = [biblioteca];
            } catch (error) {
                throw new BusinessError(
                    `Biblioteca with id ${createLibroDto.bibliotecaId} not found`,
                    BusinessErrorType.NOT_FOUND
                );
            }
        }
        
        const savedEntity = await this.libroRepository.create(entity);
        return LibroMapper.toDto(savedEntity);
    }

    async update(id: string, updateLibroDto: UpdateLibroDto): Promise<LibroDto> {

        if (updateLibroDto.fechaPublicacion) {
            // Validar que la fecha  de publicación sea menor o igual a la fecha actual
            const fechaPublicacion = new Date(updateLibroDto.fechaPublicacion);
            const fechaActual = new Date();
            if (fechaPublicacion > fechaActual) {
                throw new BusinessError(
                    'La fecha de publicación no puede ser mayor a la fecha actual',
                    BusinessErrorType.PRECONDITION_FAILED
                );
            }
        }

        const entity = LibroMapper.toEntityFromUpdate(updateLibroDto);
        
        if (updateLibroDto.bibliotecaId) {
            try {
                const biblioteca = await this.bibliotecaRepository.findOne(updateLibroDto.bibliotecaId);
                const libro = await this.libroRepository.findOne(id);
                libro.bibliotecas = libro.bibliotecas || [];
                
                if (!libro.bibliotecas.some(b => b.id === biblioteca.id)) {
                    libro.bibliotecas.push(biblioteca);
                    await this.libroRepository.create(libro);
                }
            } catch (error) {
                throw new BusinessError(
                    `Libro with id ${id} or Biblioteca with id ${updateLibroDto.bibliotecaId} not found`,
                    BusinessErrorType.NOT_FOUND
                );
            }
        }
        
        try {
            const updatedEntity = await this.libroRepository.update(id, entity);
            return LibroMapper.toDto(updatedEntity);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.libroRepository.delete(id);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${id} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async addBookToLibrary(bibliotecaId: string, libroDto: LibroDto): Promise<LibroDto> {
        try {
            const biblioteca = await this.bibliotecaRepository.findOne(bibliotecaId);
            const entity = await this.libroRepository.findOne(libroDto.id);
            if (!entity) {
                throw new BusinessError(
                    `Libro with id ${libroDto.id} not found`,
                    BusinessErrorType.NOT_FOUND
                );
            }
            
            if (!entity.bibliotecas.some(b => b.id === biblioteca.id)) {
                entity.bibliotecas.push(biblioteca);
            } else {
                throw new BusinessError(
                    'El libro ya está asociado a esta biblioteca',
                    BusinessErrorType.PRECONDITION_FAILED
                );
            }
            
            const savedEntity = await this.libroRepository.create(entity);
            return LibroMapper.toDto(savedEntity);
        } catch (error) {
            if (error instanceof BusinessError) throw error;
            throw new BusinessError(
                `Biblioteca with id ${bibliotecaId} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async findBooksFromLibrary(bibliotecaId: string): Promise<LibroDto[]> {
        try {
            await this.bibliotecaRepository.findOne(bibliotecaId);
            const entities = await this.libroRepository.findBooksFromLibrary(bibliotecaId);
            return LibroMapper.toDtoList(entities);
        } catch (error) {
            throw new BusinessError(
                `Biblioteca with id ${bibliotecaId} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroDto> {
        try {
            const entity = await this.libroRepository.findBookFromLibrary(libroId, bibliotecaId);
            return LibroMapper.toDto(entity);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${libroId} not found in biblioteca ${bibliotecaId}`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async updateBookFromLibrary(bibliotecaId: string, libroId: string, updateLibroDto: UpdateLibroDto): Promise<LibroDto> {
        try {
            const entity = LibroMapper.toEntityFromUpdate(updateLibroDto);
            const updatedEntity = await this.libroRepository.updateBooksFromLibrary(libroId, entity, bibliotecaId);
            return LibroMapper.toDto(updatedEntity);
        } catch (error) {
            throw new BusinessError(
                `Libro with id ${libroId} not found in biblioteca ${bibliotecaId}`,
                BusinessErrorType.NOT_FOUND
            );
        }
    }

    async deleteBookFromLibrary(bibliotecaId: string, libroId: string): Promise<void> {
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
