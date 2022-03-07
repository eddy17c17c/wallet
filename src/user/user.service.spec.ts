import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { CustomLogger } from '../logger/logger.service';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
    let service;
    let model: Model<User>;

    const createUserDto: CreateUserDto = {
        name: 'bob'
    };

    const mockUser = {
        name: 'bob',
        _id: '1',
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
            provide: getModelToken('User'),
            useValue: {
              new: jest.fn().mockResolvedValue(mockUser),
              constructor: jest.fn().mockResolvedValue(mockUser),
              find: jest.fn(),
              findById: jest.fn(),
              create: jest.fn(),
              exec: jest.fn(),
            },
        },
        {
            provide: CustomLogger,
            useValue: {
                log: jest.fn(),
                error: jest.fn(),
            }
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  describe('list', () => {
    it('should return users', async () => {
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce([mockUser]),
          } as any);
        expect(await service.list()).toEqual([mockUser]);
    });
  });

  describe('get', () => {
    it('should return one user', async () => {
        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(mockUser),
          } as any);
        expect(await service.get('id')).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create users', async () => {
        jest.spyOn(model, 'create').mockReturnValue({ _id: '1' });
        await service.create(createUserDto);
        expect(model.create).toBeCalled();
    });
  });

});
