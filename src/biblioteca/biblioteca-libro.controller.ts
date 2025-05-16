import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaWithLibrosDto } from './dto';
import { ValidationUtils } from '../shared/validation.utils';
import { CreateLibroDto, UpdateLibroDto, LibroDto } from '../libro/dto';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaLibroController {
    constructor(private readonly bibliotecaService: BibliotecaService) {}

    @Get(':id/books')
    async findBibliotecaWithLibros(@Param('id') id: string): Promise<BibliotecaWithLibrosDto> {
        ValidationUtils.validateUUID(id, 'biblioteca');
        return await this.bibliotecaService.findBibliotecaWithLibros(id);
    }

    @Post(':id/books')
    async addLibroToBiblioteca(@Param('id') id: string, @Body() createLibroDto: CreateLibroDto): Promise<LibroDto> {
        ValidationUtils.validateUUID(id, 'biblioteca');
        return await this.bibliotecaService.addLibroToBiblioteca(id, createLibroDto);
    }

    @Get(':bibliotecaId/books/:libroId')
    async findLibroFromBiblioteca(
        @Param('bibliotecaId') bibliotecaId: string, 
        @Param('libroId') libroId: string
    ): Promise<LibroDto> {
        ValidationUtils.validateUUID(bibliotecaId, 'biblioteca');
        ValidationUtils.validateUUID(libroId, 'libro');
        return await this.bibliotecaService.findLibroFromBiblioteca(bibliotecaId, libroId);
    }

    @Put(':bibliotecaId/books/:libroId')
    async updateLibroFromBiblioteca(
        @Param('bibliotecaId') bibliotecaId: string,
        @Param('libroId') libroId: string,
        @Body() updateLibroDto: UpdateLibroDto
    ): Promise<LibroDto> {
        ValidationUtils.validateUUID(bibliotecaId, 'biblioteca');
        ValidationUtils.validateUUID(libroId, 'libro');
        return await this.bibliotecaService.updateLibroFromBiblioteca(bibliotecaId, libroId, updateLibroDto);
    }

    @Delete(':bibliotecaId/books/:libroId')
    async deleteLibroFromBiblioteca(
        @Param('bibliotecaId') bibliotecaId: string,
        @Param('libroId') libroId: string
    ): Promise<void> {
        ValidationUtils.validateUUID(bibliotecaId, 'biblioteca');
        ValidationUtils.validateUUID(libroId, 'libro');
        return await this.bibliotecaService.deleteLibroFromBiblioteca(bibliotecaId, libroId);
    }
}
