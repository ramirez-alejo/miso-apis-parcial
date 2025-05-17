import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaDto, CreateBibliotecaDto, UpdateBibliotecaDto } from './dto';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
    constructor(private readonly bibliotecaService: BibliotecaService) {}

    @Get()
    async findAll(): Promise<BibliotecaDto[]> {
        return await this.bibliotecaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<BibliotecaDto> {
        return await this.bibliotecaService.findOne(id);
    }

    @Post()
    async create(@Body() createBibliotecaDto: CreateBibliotecaDto): Promise<BibliotecaDto> {
        return await this.bibliotecaService.create(createBibliotecaDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateBibliotecaDto: UpdateBibliotecaDto): Promise<BibliotecaDto> {
        return await this.bibliotecaService.update(id, updateBibliotecaDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        return await this.bibliotecaService.delete(id);
    }
}
