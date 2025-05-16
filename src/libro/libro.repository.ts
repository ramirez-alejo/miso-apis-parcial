import { Injectable } from "@nestjs/common";
import { LibroEntity } from "./libro.entity";
import { Repository as TypeOrmRepository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LibroRepository {
    constructor(
        @InjectRepository(LibroEntity)
        private readonly libroRepository: TypeOrmRepository<LibroEntity>
    ) {}
    
    async findAll(): Promise<LibroEntity[]> {
        return this.libroRepository.find();
    }
    
    async findByOne(id: string): Promise<LibroEntity> {
        const libro = await this.libroRepository.findOne({ 
            where: { id } 
        });
        if (!libro) {
            throw new Error(`Libro with id ${id} not found`);
        }
        return libro;
    }
    
    async create(libro: LibroEntity): Promise<LibroEntity> {
        return this.libroRepository.save(libro);
    }
    
    async update(id: string, libro: Partial<LibroEntity>): Promise<LibroEntity> {
        await this.libroRepository.update(id, libro);
        return this.findByOne(id);
    }
    
    async delete(id: string): Promise<void> {
        const result = await this.libroRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Libro with id ${id} not found`);
        }
    }
    
    async findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
        return this.libroRepository.find({ 
            where: { bibliotecas: { id: bibliotecaId } }
        });
    }

    async findBookFromLibrary(id: string, bibliotecaId: string): Promise<LibroEntity> {
        const libro = await this.libroRepository.findOne({ 
            where: { id, bibliotecas: { id: bibliotecaId } }
        });
        if (!libro) {
            throw new Error(`Libro with id ${id} not found in biblioteca with id ${bibliotecaId}`);
        }
        return libro;
    }

    async updateBooksFromLibrary(id: string, libro: Partial<LibroEntity>, bibliotecaId: string): Promise<LibroEntity> {
        await this.libroRepository.update({ id, bibliotecas: { id: bibliotecaId } }, libro);
        return this.findBookFromLibrary(id, bibliotecaId);
    }

    async deleteBookFromLibrary(id: string, bibliotecaId: string): Promise<void> {
        const result = await this.libroRepository.delete({ id, bibliotecas: { id: bibliotecaId } });
        if (result.affected === 0) {
            throw new Error(`Libro with id ${id} not found in biblioteca with id ${bibliotecaId}`);
        }
    }
}
