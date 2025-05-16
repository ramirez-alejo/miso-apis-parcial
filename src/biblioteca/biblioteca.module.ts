import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ BibliotecaEntity ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class BibliotecaModule {}
