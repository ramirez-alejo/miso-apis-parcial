
import { LibroEntity } from "../libro/libro.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ type: 'time' })
  horaApertura: string;

  @Column({ type: 'time' })
  horaCierre: string;

  @ManyToMany(() => LibroEntity, (libro) => libro.bibliotecas)
  libros: LibroEntity[];
}
