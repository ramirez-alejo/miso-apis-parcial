import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaRepository } from './biblioteca.repository';
import { LibroRepository } from '../libro/libro.repository';
import { BibliotecaEntity } from './biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';
import { BusinessError } from '../shared/business-error';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let bibliotecaRepository: BibliotecaRepository;
  let libroRepository: LibroRepository;

  const mockBibliotecaRepository = {
    findOne: jest.fn(),
  };

  const mockLibroRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findBooksFromLibrary: jest.fn(),
    findBookFromLibrary: jest.fn(),
    updateBooksFromLibrary: jest.fn(),
    deleteBookFromLibrary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibliotecaLibroService,
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

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
    bibliotecaRepository = module.get<BibliotecaRepository>(BibliotecaRepository);
    libroRepository = module.get<LibroRepository>(LibroRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    it('should throw an error if biblioteca not found', async () => {
      // Arrange
      mockBibliotecaRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findBibliotecaWithLibros('999')).rejects.toThrow(BusinessError);
    });
  });

  describe('findLibroFromBiblioteca', () => {
    it('should return a specific libro from biblioteca', async () => {
      // Arrange
      const bibliotecaId = '1';
      const libroId = '1';
      const bibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      const libroEntity: LibroEntity = {
        id: '1',
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [bibliotecaEntity],
      };

      mockLibroRepository.findBookFromLibrary.mockResolvedValue(libroEntity);

      // Act
      const result = await service.findLibroFromBiblioteca(bibliotecaId, libroId);

      // Assert
      expect(mockLibroRepository.findBookFromLibrary).toHaveBeenCalledWith(libroId, bibliotecaId);
      expect(result.id).toBe('1');
      expect(result.titulo).toBe('El Quijote');
    });

    it('should throw an error if libro not found in biblioteca', async () => {
      // Arrange
      mockLibroRepository.findBookFromLibrary.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.findLibroFromBiblioteca('1', '999')).rejects.toThrow(BusinessError);
    });
  });

  describe('addLibroToBiblioteca', () => {
    it('should add a libro to biblioteca', async () => {
      // Arrange
      const bibliotecaId = '1';
      const libroDto = {
        id: '1',
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
      };

      const bibliotecaEntity: BibliotecaEntity = {
        id: '1',
        nombre: 'Biblioteca Nacional',
        direccion: 'Calle 24 # 5-60',
        ciudad: 'Bogotá',
        horaApertura: '08:00:00',
        horaCierre: '20:00:00',
        libros: [],
      };

      const libroEntity: LibroEntity = {
        id: '1',
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [],
      };

      const savedLibroEntity = {
        ...libroEntity,
        bibliotecas: [bibliotecaEntity],
      };

      mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);
      mockLibroRepository.findOne.mockResolvedValue(libroEntity);
      mockLibroRepository.create.mockResolvedValue(savedLibroEntity);

      // Act
      const result = await service.addLibroToBiblioteca(bibliotecaId, libroDto);

      // Assert
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith(bibliotecaId);
      expect(mockLibroRepository.findOne).toHaveBeenCalledWith(libroDto.id);
      expect(mockLibroRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('1');
      expect(result.titulo).toBe('El Quijote');
    });

    it('should throw an error if biblioteca not found', async () => {
      // Arrange
      mockBibliotecaRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addLibroToBiblioteca('999', { id: '1' } as any)).rejects.toThrow(BusinessError);
    });

    it('should throw an error if libro not found', async () => {
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
      mockLibroRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addLibroToBiblioteca('1', { id: '999' } as any)).rejects.toThrow(BusinessError);
    });
  });

  describe('updateLibroFromBiblioteca', () => {
    it('should update a libro in biblioteca', async () => {
      // Arrange
      const bibliotecaId = '1';
      const libroId = '1';
      const updateLibroDto = {
        titulo: 'El Quijote (Edición Actualizada)',
      };

      const updatedLibroEntity: LibroEntity = {
        id: '1',
        titulo: 'El Quijote (Edición Actualizada)',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [],
      };

      mockLibroRepository.updateBooksFromLibrary.mockResolvedValue(updatedLibroEntity);

      // Act
      const result = await service.updateLibroFromBiblioteca(bibliotecaId, libroId, updateLibroDto);

      // Assert
      expect(mockLibroRepository.updateBooksFromLibrary).toHaveBeenCalledWith(libroId, expect.any(Object), bibliotecaId);
      expect(result.id).toBe('1');
      expect(result.titulo).toBe('El Quijote (Edición Actualizada)');
    });

    it('should throw an error if libro not found in biblioteca', async () => {
      // Arrange
      mockLibroRepository.updateBooksFromLibrary.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.updateLibroFromBiblioteca('1', '999', {})).rejects.toThrow(BusinessError);
    });
  });

  describe('deleteLibroFromBiblioteca', () => {
    it('should delete a libro from biblioteca', async () => {
      // Arrange
      mockLibroRepository.deleteBookFromLibrary.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.deleteLibroFromBiblioteca('1', '1')).resolves.not.toThrow();
      expect(mockLibroRepository.deleteBookFromLibrary).toHaveBeenCalledWith('1', '1');
    });

    it('should throw an error if libro not found in biblioteca', async () => {
      // Arrange
      mockLibroRepository.deleteBookFromLibrary.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.deleteLibroFromBiblioteca('1', '999')).rejects.toThrow(BusinessError);
    });
  });
});
