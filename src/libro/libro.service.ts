import { Injectable } from "@nestjs/common";
import { LibroRepository } from "./libro.repository";
import { LibroDto, CreateLibroDto, UpdateLibroDto } from "./dto";
import { Service } from "../shared/service.interface";
import { LibroMapper } from "./mapper/libro.mapper";
import { BibliotecaRepository } from "../biblioteca/biblioteca.repository";

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
        const entity = await this.libroRepository.findByOne(id);
        return LibroMapper.toDto(entity);
    }

    async create(createLibroDto: CreateLibroDto): Promise<LibroDto> {

        const entity = LibroMapper.toEntityFromCreate(createLibroDto);
        
        if (createLibroDto.bibliotecaId) {
            const biblioteca = await this.bibliotecaRepository.findByOne(createLibroDto.bibliotecaId);
            entity.bibliotecas = [biblioteca];
        }
        
        const savedEntity = await this.libroRepository.create(entity);
        
        return LibroMapper.toDto(savedEntity);
    }

    async update(id: string, updateLibroDto: UpdateLibroDto): Promise<LibroDto> {
        const entity = LibroMapper.toEntityFromUpdate(updateLibroDto);
        
        if (updateLibroDto.bibliotecaId) {
            const biblioteca = await this.bibliotecaRepository.findByOne(updateLibroDto.bibliotecaId);
            const libro = await this.libroRepository.findByOne(id);
            libro.bibliotecas = libro.bibliotecas || [];
            
            if (!libro.bibliotecas.some(b => b.id === biblioteca.id)) {
                libro.bibliotecas.push(biblioteca);
                await this.libroRepository.create(libro); // Save the relationship
            }
        }
        
        const updatedEntity = await this.libroRepository.update(id, entity);
        
        return LibroMapper.toDto(updatedEntity);
    }

    async delete(id: string): Promise<void> {
        await this.libroRepository.delete(id);
    }


    async addBookToLibrary(bibliotecaId: string, createLibroDto: CreateLibroDto): Promise<LibroDto> {
        // Ensure the biblioteca exists
        const biblioteca = await this.bibliotecaRepository.findByOne(bibliotecaId);
        
        const entity = LibroMapper.toEntityFromCreate(createLibroDto);
        
        if (!entity.bibliotecas.some(b => b.id === biblioteca.id)) {
            entity.bibliotecas.push(biblioteca);
        }
        
        const savedEntity = await this.libroRepository.create(entity);
        
        return LibroMapper.toDto(savedEntity);
    }

    async findBooksFromLibrary(bibliotecaId: string): Promise<LibroDto[]> {
        await this.bibliotecaRepository.findByOne(bibliotecaId);
        
        const entities = await this.libroRepository.findBooksFromLibrary(bibliotecaId);
        
        return LibroMapper.toDtoList(entities);
    }

    async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroDto> {
        const entity = await this.libroRepository.findBookFromLibrary(libroId, bibliotecaId);
        
        return LibroMapper.toDto(entity);
    }

    async updateBookFromLibrary(bibliotecaId: string, libroId: string, updateLibroDto: UpdateLibroDto): Promise<LibroDto> {
        const entity = LibroMapper.toEntityFromUpdate(updateLibroDto);
        
        const updatedEntity = await this.libroRepository.updateBooksFromLibrary(libroId, entity, bibliotecaId);
        
        return LibroMapper.toDto(updatedEntity);
    }

    async deleteBookFromLibrary(bibliotecaId: string, libroId: string): Promise<void> {
        await this.libroRepository.deleteBookFromLibrary(libroId, bibliotecaId);
    }
}
