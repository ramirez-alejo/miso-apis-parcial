import { Injectable } from "@nestjs/common";
import { BibliotecaRepository } from "./biblioteca.repository";
import { LibroRepository } from "../libro/libro.repository";
import { BibliotecaWithLibrosDto } from "./dto";
import { LibroDto, UpdateLibroDto } from "../libro/dto";
import { BibliotecaMapper } from "./mapper/biblioteca.mapper";
import { LibroMapper } from "../libro/mapper/libro.mapper";
import { BusinessError, BusinessErrorType } from "../shared/business-error";

@Injectable()
export class BibliotecaLibroService {
    constructor(
        private readonly bibliotecaRepository: BibliotecaRepository,
        private readonly libroRepository: LibroRepository
    ) {}

    async findBibliotecaWithLibros(bibliotecaId: string): Promise<BibliotecaWithLibrosDto> {
        const biblioteca = await this.bibliotecaRepository.findOne(bibliotecaId);
        if (!biblioteca) {
            throw new BusinessError(
                `Biblioteca with id ${bibliotecaId} not found`,
                BusinessErrorType.NOT_FOUND
            );
        }
        const libros = await this.libroRepository.findBooksFromLibrary(bibliotecaId);
        const bibliotecaDto = BibliotecaMapper.toDto(biblioteca);
        const librosDtos = LibroMapper.toDtoList(libros);
        const result = new BibliotecaWithLibrosDto();
        Object.assign(result, bibliotecaDto);
        result.libros = librosDtos;
        return result;
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

    async addLibroToBiblioteca(bibliotecaId: string, libroDto: LibroDto): Promise<LibroDto> {
        const biblioteca = await this.bibliotecaRepository.findOne(bibliotecaId);
        if (!biblioteca) {
            throw new BusinessError(
                `Biblioteca with id ${bibliotecaId} not found`,
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
