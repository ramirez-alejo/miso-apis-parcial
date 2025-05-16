import { Module } from '@nestjs/common';
import { LibroEntity } from './libro.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([ LibroEntity ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class LibroModule {}
