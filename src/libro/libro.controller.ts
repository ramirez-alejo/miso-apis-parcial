import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { LibroService } from './libro.service';
import { LibroDto, CreateLibroDto, UpdateLibroDto, LibroWithBibliotecaDto } from './dto';
import { ValidationUtils } from '../shared/validation.utils';
import { BibliotecaDto } from '../biblioteca/dto';

@Controller('books')
@UseInterceptors(BusinessErrorsInterceptor)
export class LibroController {
    constructor(private readonly libroService: LibroService) {}

    @Get()
    async findAll(): Promise<LibroDto[]> {
        return await this.libroService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<LibroDto> {
        ValidationUtils.validateUUID(id, 'libro');
        return await this.libroService.findOne(id);
    }

    @Post()
    async create(@Body() createLibroDto: CreateLibroDto): Promise<LibroDto> {
        return await this.libroService.create(createLibroDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateLibroDto: UpdateLibroDto): Promise<LibroDto> {
        ValidationUtils.validateUUID(id, 'libro');
        return await this.libroService.update(id, updateLibroDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        ValidationUtils.validateUUID(id, 'libro');
        return await this.libroService.delete(id);
    }
}
