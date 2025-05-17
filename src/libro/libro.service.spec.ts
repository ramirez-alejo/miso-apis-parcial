import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { LibroRepository } from './libro.repository';
import { BibliotecaRepository } from '../biblioteca/biblioteca.repository';
import { LibroDto, CreateLibroDto, UpdateLibroDto } from './dto';
import { LibroEntity } from './libro.entity';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';

describe('LibroService', () => {
  let service: LibroService;
  let libroRepository: LibroRepository;
  let bibliotecaRepository: BibliotecaRepository;

  const mockLibroRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findBooksFromLibrary: jest.fn(),
    findBookFromLibrary: jest.fn(),
    updateBooksFromLibrary: jest.fn(),
    deleteBookFromLibrary: jest.fn(),
  };

  const mockBibliotecaRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibroService,
        {
          provide: LibroRepository,
          useValue: mockLibroRepository,
        },
        {
          provide: BibliotecaRepository,
          useValue: mockBibliotecaRepository,
        },
      ],
    }).compile();

    service = module.get<LibroService>(LibroService);
    libroRepository = module.get<LibroRepository>(LibroRepository);
    bibliotecaRepository = module.get<BibliotecaRepository>(BibliotecaRepository);

    // Reset the mock calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of libros DTOs', async () => {
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

      mockLibroRepository.findAll.mockResolvedValue(libroEntities);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockLibroRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].titulo).toBe('El Quijote');
    });
  });

  describe('findOne', () => {
    it('should return a libro DTO', async () => {
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

      const libroEntity: LibroEntity = {
        id: '1',
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [bibliotecaEntity],
      };

      mockLibroRepository.findOne.mockResolvedValue(libroEntity);

      // Act
      const result = await service.findOne('1');

      // Assert
      expect(mockLibroRepository.findOne).toHaveBeenCalledWith('1');
      expect(result.id).toBe('1');
      expect(result.titulo).toBe('El Quijote');
    });

    it('should throw an error if libro not found', async () => {
      // Arrange
      mockLibroRepository.findOne.mockRejectedValue(new Error('Libro with id 999 not found'));

      // Act & Assert
      await expect(service.findOne('999')).rejects.toThrowError('Libro with id 999 not found');
    });
  });

  describe('create', () => {
    it('should create and return a libro DTO', async () => {
      // Arrange
      const createLibroDto: CreateLibroDto = {
        titulo: 'Nuevo Libro',
        autor: 'Autor Nuevo',
        fechaPublicacion: '2023-01-01',
        isbn: '9781234567897',
        bibliotecaId: '1',
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
        id: '2',
        titulo: 'Nuevo Libro',
        autor: 'Autor Nuevo',
        fechaPublicacion: new Date('2023-01-01'),
        isbn: '9781234567897',
        bibliotecas: [bibliotecaEntity],
      };

      mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);
      mockLibroRepository.create.mockResolvedValue(libroEntity);

      // Act
      const result = await service.create(createLibroDto);

      // Assert
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith('1');
      expect(mockLibroRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('2');
      expect(result.titulo).toBe('Nuevo Libro');
    });

    it('should create a libro without biblioteca if bibliotecaId is not provided', async () => {
      // Arrange
      const createLibroDto: CreateLibroDto = {
        titulo: 'Libro Sin Biblioteca',
        autor: 'Autor Independiente',
        fechaPublicacion: '2023-01-01',
        isbn: '9781234567897',
        bibliotecaId: '',
      };

      const libroEntity: LibroEntity = {
        id: '3',
        titulo: 'Libro Sin Biblioteca',
        autor: 'Autor Independiente',
        fechaPublicacion: new Date('2023-01-01'),
        isbn: '9781234567897',
        bibliotecas: [],
      };

      mockLibroRepository.create.mockResolvedValue(libroEntity);

      // Act
      const result = await service.create(createLibroDto);

      // Assert
      expect(mockBibliotecaRepository.findOne).not.toHaveBeenCalled();
      expect(mockLibroRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('3');
      expect(result.titulo).toBe('Libro Sin Biblioteca');
    });
  });

  describe('update', () => {
    it('should update and return a libro DTO', async () => {
      // Arrange
      const updateLibroDto: UpdateLibroDto = {
        titulo: 'Libro Actualizado',
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

      const updatedLibroEntity: LibroEntity = {
        id: '1',
        titulo: 'Libro Actualizado',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [bibliotecaEntity],
      };

      mockLibroRepository.update.mockResolvedValue(updatedLibroEntity);

      // Act
      const result = await service.update('1', updateLibroDto);

      // Assert
      expect(mockLibroRepository.update).toHaveBeenCalled();
      expect(result.id).toBe('1');
      expect(result.titulo).toBe('Libro Actualizado');
    });

    it('should update libro with new biblioteca if bibliotecaId is provided', async () => {
      // Arrange
      const updateLibroDto: UpdateLibroDto = {
        titulo: 'Libro Actualizado',
        bibliotecaId: '2',
      };

      const nuevaBibliotecaEntity: BibliotecaEntity = {
        id: '2',
        nombre: 'Nueva Biblioteca',
        direccion: 'Nueva Dirección',
        ciudad: 'Nueva Ciudad',
        horaApertura: '09:00:00',
        horaCierre: '19:00:00',
        libros: [],
      };

      const existingLibroEntity: LibroEntity = {
        id: '1',
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [],
      };

      const updatedLibroEntity: LibroEntity = {
        id: '1',
        titulo: 'Libro Actualizado',
        autor: 'Miguel de Cervantes',
        fechaPublicacion: new Date('1605-01-01'),
        isbn: '1234567890123',
        bibliotecas: [nuevaBibliotecaEntity],
      };

      mockBibliotecaRepository.findOne.mockResolvedValue(nuevaBibliotecaEntity);
      mockLibroRepository.findOne.mockResolvedValue(existingLibroEntity);
      mockLibroRepository.create.mockResolvedValue(existingLibroEntity);
      mockLibroRepository.update.mockResolvedValue(updatedLibroEntity);

      // Act
      const result = await service.update('1', updateLibroDto);

      // Assert
      expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith('2');
      expect(mockLibroRepository.findOne).toHaveBeenCalledWith('1');
      expect(mockLibroRepository.update).toHaveBeenCalled();
      expect(result.id).toBe('1');
      expect(result.titulo).toBe('Libro Actualizado');
    });
  });

  describe('delete', () => {
    it('should call repository delete method', async () => {
      // Arrange
      mockLibroRepository.delete.mockResolvedValue(undefined);

      // Act
      await service.delete('1');

      // Assert
      expect(mockLibroRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Association methods', () => {
    describe('addBookToLibrary', () => {
      it('should add a book to a library', async () => {
        // Arrange
        const bibliotecaId = '1';
        const libroDto: LibroDto = {
          titulo: 'Nuevo Libro',
          autor: 'Autor Nuevo',
          id: '2',
          isbn: '9781234567897',
          fechaPublicacion: new Date('2023-01-01'),
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
          id: '2',
          titulo: 'Nuevo Libro',
          autor: 'Autor Nuevo',
          fechaPublicacion: new Date('2023-01-01'),
          isbn: '9781234567897',
          bibliotecas: [bibliotecaEntity],
        };

        mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);
        mockLibroRepository.create.mockResolvedValue(libroEntity);

        // Act
        const result = await service.addBookToLibrary(bibliotecaId, libroDto);

        // Assert
        expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith(bibliotecaId);
        expect(mockLibroRepository.create).toHaveBeenCalled();
        expect(result.id).toBe('2');
        expect(result.titulo).toBe('Nuevo Libro');
      });
    });

    describe('findBooksFromLibrary', () => {
      it('should return all books from a library', async () => {
        // Arrange
        const bibliotecaId = '1';
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
          {
            id: '2',
            titulo: 'Cien Años de Soledad',
            autor: 'Gabriel García Márquez',
            fechaPublicacion: new Date('1967-01-01'),
            isbn: '9876543210987',
            bibliotecas: [bibliotecaEntity],
          },
        ];

        mockBibliotecaRepository.findOne.mockResolvedValue(bibliotecaEntity);
        mockLibroRepository.findBooksFromLibrary.mockResolvedValue(libroEntities);

        // Act
        const result = await service.findBooksFromLibrary(bibliotecaId);

        // Assert
        expect(mockBibliotecaRepository.findOne).toHaveBeenCalledWith(bibliotecaId);
        expect(mockLibroRepository.findBooksFromLibrary).toHaveBeenCalledWith(bibliotecaId);
        expect(result).toHaveLength(2);
        expect(result[0].titulo).toBe('El Quijote');
        expect(result[1].titulo).toBe('Cien Años de Soledad');
      });
    });

    describe('findBookFromLibrary', () => {
      it('should return a specific book from a library', async () => {
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
        const result = await service.findBookFromLibrary(bibliotecaId, libroId);

        // Assert
        expect(mockLibroRepository.findBookFromLibrary).toHaveBeenCalledWith(libroId, bibliotecaId);
        expect(result.id).toBe('1');
        expect(result.titulo).toBe('El Quijote');
      });
    });

    describe('updateBookFromLibrary', () => {
      it('should update a book in a library', async () => {
        // Arrange
        const bibliotecaId = '1';
        const libroId = '1';
        const updateLibroDto: UpdateLibroDto = {
          titulo: 'El Quijote (Edición Actualizada)',
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

        const updatedLibroEntity: LibroEntity = {
          id: '1',
          titulo: 'El Quijote (Edición Actualizada)',
          autor: 'Miguel de Cervantes',
          fechaPublicacion: new Date('1605-01-01'),
          isbn: '1234567890123',
          bibliotecas: [bibliotecaEntity],
        };

        mockLibroRepository.updateBooksFromLibrary.mockResolvedValue(updatedLibroEntity);

        // Act
        const result = await service.updateBookFromLibrary(bibliotecaId, libroId, updateLibroDto);

        // Assert
        expect(mockLibroRepository.updateBooksFromLibrary).toHaveBeenCalledWith(libroId, expect.any(Object), bibliotecaId);
        expect(result.id).toBe('1');
        expect(result.titulo).toBe('El Quijote (Edición Actualizada)');
      });
    });

    
  });
});
