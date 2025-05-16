
import { BibliotecaEntity } from 'src/biblioteca/biblioteca.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('libro')
export class LibroEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  titulo: string;

  @Column({ length: 100 })
  autor: string;

  @Column()
  fechaPublicacion: Date;

  @Column({ length: 20 })
  isbn: string;

  @OneToMany(() => BibliotecaEntity, (biblioteca) => biblioteca.libros)
  biblioteca: BibliotecaEntity;
}
