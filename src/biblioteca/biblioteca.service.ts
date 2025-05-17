import { Injectable } from "@nestjs/common";
import { BibliotecaRepository } from "./biblioteca.repository";
import { BibliotecaDto, CreateBibliotecaDto, UpdateBibliotecaDto } from "./dto";
import { Service } from "../shared/service.interface";
import { BibliotecaMapper } from "./mapper/biblioteca.mapper";
import { BusinessError, BusinessErrorType } from "../shared/business-error";

@Injectable()
export class BibliotecaService implements Service<BibliotecaDto> {
    constructor(
        private readonly bibliotecaRepository: BibliotecaRepository
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
}
