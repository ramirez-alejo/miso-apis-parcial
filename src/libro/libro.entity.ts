import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

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

  @ManyToMany(() => BibliotecaEntity, (biblioteca) => biblioteca.libros)
  @JoinTable()
  bibliotecas: BibliotecaEntity[];
}
