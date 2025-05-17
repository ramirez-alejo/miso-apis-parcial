import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaRepository } from './biblioteca.repository';
import { LibroRepository } from '../libro/libro.repository';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaController } from './biblioteca.controller';
import { BibliotecaLibroController } from './biblioteca-libro.controller';
import { BibliotecaLibroService } from './biblioteca-libro.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity]),
    ],
    controllers: [BibliotecaController, BibliotecaLibroController],
    providers: [BibliotecaService, BibliotecaLibroService, BibliotecaRepository, LibroRepository],
    exports: [BibliotecaService, BibliotecaRepository, BibliotecaLibroService],
})
export class BibliotecaModule {}
