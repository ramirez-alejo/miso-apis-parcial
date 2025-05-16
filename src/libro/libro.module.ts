import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';
import { LibroService } from './libro.service';
import { LibroRepository } from './libro.repository';
import { BibliotecaRepository } from '../biblioteca/biblioteca.repository';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroController } from './libro.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([LibroEntity, BibliotecaEntity]),
    ],
    controllers: [LibroController],
    providers: [LibroService, LibroRepository, BibliotecaRepository],
    exports: [LibroService, LibroRepository],
})
export class LibroModule {}
