import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaWithLibrosDto } from './dto';
import { CreateLibroDto, UpdateLibroDto, LibroDto } from '../libro/dto';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaLibroController {
    constructor(private readonly bibliotecaService: BibliotecaService) {}

    // findBooksFromLibrary
    @Get(':bibliotecaId/books')
    async findAll(@Param('bibliotecaId') bibliotecaId: string): Promise<BibliotecaWithLibrosDto> {
        return await this.bibliotecaService.findBibliotecaWithLibros(bibliotecaId);
    }

    // findBookFromLibrary
    @Get(':bibliotecaId/books/:libroId')
    async findOne(@Param('bibliotecaId') bibliotecaId: string, @Param('libroId') libroId: string): Promise<LibroDto> {
        return await this.bibliotecaService.findLibroFromBiblioteca(bibliotecaId, libroId);
    }

    // addBookToLibrary
    @Post(':bibliotecaId/books')
    async addBookToLibrary(@Param('bibliotecaId') bibliotecaId: string, @Body() libroDto: LibroDto): Promise<LibroDto> {
        return await this.bibliotecaService.addLibroToBiblioteca(bibliotecaId, libroDto);
    }

    // updateBooksFromLibrary
    @Put(':bibliotecaId/books/:libroId')
    async update(@Param('bibliotecaId') bibliotecaId: string, @Param('libroId') libroId: string, @Body() updateLibroDto: UpdateLibroDto): Promise<LibroDto> {
        return await this.bibliotecaService.updateLibroFromBiblioteca(bibliotecaId, libroId, updateLibroDto);
    }

    // deleteBookFromLibrary
    @Delete(':bibliotecaId/books/:libroId')
    @HttpCode(204)
    async delete(@Param('bibliotecaId') bibliotecaId: string, @Param('libroId') libroId: string): Promise<void> {
        return await this.bibliotecaService.deleteLibroFromBiblioteca(bibliotecaId, libroId);
    }
}
