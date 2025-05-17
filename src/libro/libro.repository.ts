import { Injectable } from "@nestjs/common";
import { LibroEntity } from "./libro.entity";
import { Repository as TypeOrmRepository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessError, BusinessErrorType } from "../shared/business-error";

@Injectable()
export class LibroRepository {
    constructor(
        @InjectRepository(LibroEntity)
        private readonly libroRepository: TypeOrmRepository<LibroEntity>
    ) {}
    
    async findAll(): Promise<LibroEntity[]> {
        return this.libroRepository.find();
    }
    
    async findOne(id: string): Promise<LibroEntity> {
        const libro = await this.libroRepository.findOne({ 
            where: { id } 
        });
        if (!libro) {
            throw new BusinessError(`Libro con id ${id} no encontrado`, BusinessErrorType.NOT_FOUND);
        }
        return libro;
    }
    
    async create(libro: LibroEntity): Promise<LibroEntity> {
        return this.libroRepository.save(libro);
    }
    
    async update(id: string, libro: Partial<LibroEntity>): Promise<LibroEntity> {
        await this.libroRepository.update(id, libro);
        return this.findOne(id);
    }
    
    async delete(id: string): Promise<void> {
        const result = await this.libroRepository.delete(id);
        if (result.affected === 0) {
            throw new BusinessError(`Libro con id ${id} no encontrado`, BusinessErrorType.NOT_FOUND);
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
            throw new BusinessError(`Libro con id ${id} no encontrado en biblioteca con id ${bibliotecaId}`, BusinessErrorType.NOT_FOUND);
        }
        return libro;
    }

    async updateBooksFromLibrary(id: string, libro: Partial<LibroEntity>, bibliotecaId: string): Promise<LibroEntity> {
        await this.libroRepository.update({ id, bibliotecas: { id: bibliotecaId } }, libro);
        return this.findBookFromLibrary(id, bibliotecaId);
    }

    async deleteBookFromLibrary(id: string, bibliotecaId: string): Promise<void> {
        // load the book with the realationship0
        const libro = await this.libroRepository.findOne({
            where: { id, bibliotecas: { id: bibliotecaId } },
            relations: ['bibliotecas']
        });
        if (!libro) {
            throw new BusinessError(`Libro con id ${id} no encontrado en biblioteca con id ${bibliotecaId}`, BusinessErrorType.NOT_FOUND);
        }

        libro.bibliotecas = libro.bibliotecas.filter(b => b.id !== bibliotecaId);
        await this.libroRepository.save(libro);
        
    }
}
