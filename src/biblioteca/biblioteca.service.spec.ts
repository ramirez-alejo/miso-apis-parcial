import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaRepository } from './biblioteca.repository';
import { LibroRepository } from '../libro/libro.repository';
import { BibliotecaDto, CreateBibliotecaDto, UpdateBibliotecaDto } from './dto';
import { LibroDto } from '../libro/dto';
import { BibliotecaEntity } from './biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaMapper } from './mapper/biblioteca.mapper';
import { mock } from 'node:test';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let bibliotecaRepository: BibliotecaRepository;
  let libroRepository: LibroRepository;

  const mockBibliotecaRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLibroRepository = {
    findBooksFromLibrary: jest.fn(),
    findBookFromLibrary: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateBooksFromLibrary: jest.fn(),
    deleteBookFromLibrary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibliotecaService,
        {
          provide: BibliotecaRepository,
          useValue: mockBibliotecaRepository,
        },
        {
          provide: LibroRepository,
          useValue: mockLibroRepository,
        },
      ],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    bibliotecaRepository = module.get<BibliotecaRepository>(BibliotecaRepository);
    libroRepository = module.get<LibroRepository>(LibroRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bibliotecas DTOs', async () => {
      // Arrange
      const bibliotecaEntities: BibliotecaEntity[] = [
        {
          id: '1',
          nombre: 'Biblioteca Nacional',
          direccion: 'Calle 24 # 5-60',
          ciudad: 'Bogotá',
          horaApertura: '08:00:00',
          horaCierre: '20:00:00',
          libros: [],
        },
      ];

      mockBibliotecaRepository.findAll.mockResolvedValue(bibliotecaEntities);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockBibliotecaRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].nombre).toBe('Biblioteca Nacional');
    });
  });

  describe('findOne', () => {
    it('should return a biblioteca DTO', async () => {
      // Arrange
      const bibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);

      // Act
      const result = await service.findOne('1');

      // Assert
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
      expect(result.nombre).toBe('Biblioteca Nacional');
    });

    it('should throw an error if biblioteca not found', async () => {
      // Arrange
      mockBibliotecaRepository.findOne.mockRejectedValue(new Error('Biblioteca with id 999 not found'));

      // Act & Assert
      await expect(service.findOne('999')).rejects.toThrowError('Biblioteca with id 999 not found');
    });
  });

  describe('create', () => {
    it('should create and return a biblioteca DTO', async () => {
      // Arrange
      const createBibliotecaDto: CreateBibliotecaDto = {
        nombre: 'Nueva Biblioteca',
        direccion: 'Calle 123',
        ciudad: 'Medellín',
        horaApertura: '09:00:00',
        horaCierre: '18:00:00',
      };

      const bibliotecaEntity: BibliotecaEntity = {
        id: '2',
        nombre: 'Nueva Biblioteca',
        direccion: 'Calle 123',
        ciudad: 'Medellín',
        horaApertura: '09:00:00',
        horaCierre: '18:00:00',
        libros: [],
      };

      mockBibliotecaRepository.create.mockResolvedValue(bibliotecaEntity);

      // Act
      const result = await service.create(createBibliotecaDto);

      // Assert
      expect(mockBibliotecaRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('2');
      expect(result.nombre).toBe('Nueva Biblioteca');
    });

    it('should throw an error if horaApertura is after horaCierre', async () => {
      // Arrange
      const createBibliotecaDto: CreateBibliotecaDto = {
        nombre: 'Nueva Biblioteca',
        direccion: 'Calle 123',
        ciudad: 'Medellín',
        horaApertura: '19:00:00',
        horaCierre: '18:00:00',
      };

      // Spy on BibliotecaMapper.toEntityFromCreate to prevent it from being called
      jest.spyOn(BibliotecaMapper, 'toEntityFromCreate').mockImplementation(() => {
        throw new Error('BibliotecaMapper.toEntityFromCreate should not be called');
      });

      // Act & Assert
      await expect(service.create(createBibliotecaDto)).rejects.toThrowError(
        'La hora de apertura debe ser menor que la hora de cierre'
      );
    });
  });

  describe('update', () => {
    it('should update and return a biblioteca DTO', async () => {
      // Arrange
      const updateBibliotecaDto: UpdateBibliotecaDto = {
        nombre: 'Biblioteca Actualizada',
      };

      const existingBibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      const updatedBibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Actualizada',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      mockBibliotecaRepository.update.mockResolvedValue(updatedBibliotecaEntity);

      // Act
      const result = await service.update('1', updateBibliotecaDto);

      // Assert
      expect(mockBibliotecaRepository.update).toHaveBeenCalled();
      expect(result.id).toBe('1');
      expect(result.nombre).toBe('Biblioteca Actualizada');
    });

    it('should throw an error if horaApertura is after horaCierre when both are provided', async () => {
      // Arrange
      const updateBibliotecaDto: UpdateBibliotecaDto = {
        horaApertura: '19:00:00',
        horaCierre: '18:00:00',
      };

      // Spy on BibliotecaMapper.toEntityFromUpdate to prevent it from being called
      jest.spyOn(BibliotecaMapper, 'toEntityFromUpdate').mockImplementation(() => {
        throw new Error('BibliotecaMapper.toEntityFromUpdate should not be called');
      });

      // Act & Assert
      await expect(service.update('1', updateBibliotecaDto)).rejects.toThrowError(
        'La hora de apertura debe ser menor que la hora de cierre'
      );
    });

    it('should check existing entity when only one time field is updated', async () => {
      // Arrange
      const updateBibliotecaDto: UpdateBibliotecaDto = {
        horaApertura: '19:00:00',
      };

      const existingBibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '18:00:00',
        libros: [],
      };

      mockBibliotecaRepository.findOne.mockResolvedValue(existingBibliotecaEntity);
      
      jest.spyOn(BibliotecaMapper, 'toEntityFromUpdate').mockImplementation(() => {
        throw new Error('BibliotecaMapper.toEntityFromUpdate should not be called');
      });

      // Act & Assert
      await expect(service.update('1', updateBibliotecaDto)).rejects.toThrowError(
        'La hora de apertura debe ser menor que la hora de cierre'
      );
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('delete', () => {
    it('should call repository delete method', async () => {
      // Arrange
      mockBibliotecaRepository.delete.mockResolvedValue(undefined);

      // Act
      await service.delete('1');

      // Assert
      expect(mockBibliotecaRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('findBibliotecaWithLibros', () => {
    it('should return a biblioteca with its libros', async () => {
      // Arrange
      const bibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      const libroEntities: LibroEntity[] = [
        {
          id: '1',
          titulo: 'El Quijote',
          autor: 'Miguel de Cervantes',
          fechaPublicacion: new Date('1605-01-01'),
          isbn: '1234567890123',
          bibliotecas: [bibliotecaEntity],
        },
      ];

      mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);
      mockLibroRepository.findBooksFromLibrary.mockResolvedValue(libroEntities);

      // Act
      const result = await service.findBibliotecaWithLibros('1');

      // Assert
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith('1');
      expect(mockLibroRepository.findBooksFromLibrary).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
      expect(result.nombre).toBe('Biblioteca Nacional');
      expect(result.libros).toHaveLength(1);
      expect(result.libros[0].titulo).toBe('El Quijote');
    });
  });

  describe('addLibroToBiblioteca', () => {
    it('should add a libro to a biblioteca', async () => {
      // Arrange
      const bibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      const libroDto = {
          id: '1',
          titulo: 'El Quijote',
          autor: 'Miguel de Cervantes',
          fechaPublicacion: new Date('1605-01-01'),
          isbn: '1234567890123',
          bibliotecas: [],
        };

      const savedLibroEntity: LibroEntity = {
        id: '2',
        titulo: 'Nuevo Libro',
        autor: 'Autor Nuevo',
        fechaPublicacion: new Date('2023-01-01'),
        isbn: '9781234567897',
        bibliotecas: [bibliotecaEntity],
      };

      mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);
      mockLibroRepository.create.mockResolvedValue(savedLibroEntity);

      mockLibroRepository.findOne.mockResolvedValue(libroDto);

      // Act
      const result = await service.addLibroToBiblioteca('1', libroDto);

      // Assert
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith('1');
      expect(mockLibroRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('2');
      expect(result.titulo).toBe('Nuevo Libro');
    });
  });
});
