import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BibliotecaEntity } from "./biblioteca.entity";
import { Repository as TypeOrmRepository } from 'typeorm';

@Injectable()
export class BibliotecaRepository {
    constructor(
        @InjectRepository(BibliotecaEntity)
        private readonly bibliotecaRepository: TypeOrmRepository<BibliotecaEntity>
    ) {}
    
    async findAll(): Promise<BibliotecaEntity[]> {
        return this.bibliotecaRepository.find();
    }

    async findByOne(id: string): Promise<BibliotecaEntity> {
        const biblioteca = await this.bibliotecaRepository.findOne({ 
            where: { id } 
        });
        if (!biblioteca) {
            throw new Error(`Biblioteca with id ${id} not found`);
        }
        return biblioteca;
    }

    async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
        return this.bibliotecaRepository.save(biblioteca);
    }

    async update(id: string, biblioteca: Partial<BibliotecaEntity>): Promise<BibliotecaEntity> {
        await this.bibliotecaRepository.update(id, biblioteca);
        return this.findByOne(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.bibliotecaRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Biblioteca with id ${id} not found`);
        }
    }

}
