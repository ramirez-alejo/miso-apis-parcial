import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaRepository } from './biblioteca.repository';
import { LibroRepository } from '../libro/libro.repository';
import { LibroEntity } from '../libro/libro.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity]),
    ],
    controllers: [],
    providers: [BibliotecaService, BibliotecaRepository, LibroRepository],
    exports: [BibliotecaService, BibliotecaRepository],
})
export class BibliotecaModule {}
