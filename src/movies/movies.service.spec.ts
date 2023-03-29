import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  const createSampleMovie = () => {
    service.create({
      title: 'Test',
      year: 2000,
      genres: ['test'],
    });
  };

  const getAllMoviesLength = () => service.getAll().length;

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      createSampleMovie();
      const movie = service.getOne(1);
      expect(movie.id).toEqual(1);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(9999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Not Found Movie with Id 9999');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = getAllMoviesLength();
      createSampleMovie();
      const afterCreate = getAllMoviesLength();
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      createSampleMovie();
      const beforeDelete = getAllMoviesLength();
      service.deleteOne(1);
      const afterDelete = getAllMoviesLength();
      expect(afterDelete).toBeLessThan(beforeDelete);
    });
    it('should throw 404 error', () => {
      try {
        service.deleteOne(4444);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    const toBeUpdatedTitle = 'updatedTitle';
    const toBeUpdatedYear = 3000;
    const toBeUpdatedGenres = ['update'];
    const updateAMovie = () => {
      service.update(1, {
        title: toBeUpdatedTitle,
        year: toBeUpdatedYear,
        genres: toBeUpdatedGenres,
      });
    };
    it('should return a updated movie', () => {
      createSampleMovie();
      updateAMovie();
      const updatedMovie = service.getOne(1);
      expect(updatedMovie.title).toEqual(toBeUpdatedTitle);
      expect(updatedMovie.year).toEqual(toBeUpdatedYear);
      expect(updatedMovie.genres).toEqual(toBeUpdatedGenres);
    });

    it('should throw a 404 error', () => {
      try {
        updateAMovie();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
