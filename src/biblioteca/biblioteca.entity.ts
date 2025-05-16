
import { LibroEntity } from "src/libro/libro.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('biblioteca')
export class BibliotecaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 200 })
  direccion: string;

  @Column({ length: 50 })
  ciudad: string;

  @Column({ length: 50 })
  horarioAtencion: string;

  @OneToMany(() => LibroEntity, (libro) => libro.biblioteca)
  libros: LibroEntity[];
}

