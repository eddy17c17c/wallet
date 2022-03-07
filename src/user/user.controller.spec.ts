import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { CustomLogger } from '../logger/logger.service';

describe('UserController', () => {
    let controller, service;

    const createUserDto: CreateUserDto = {
        name: 'bob'
    };

    const mockUser = {
        name: 'bob',
        _id: '1',
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            list: jest.fn().mockImplementation(() => [mockUser]),
            get: jest.fn().mockImplementation((id) => (mockUser)),
            create: jest.fn().mockImplementation(() => '1'),
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('list', () => {
    it('should return users', async () => {
        expect(await controller.list()).toEqual([mockUser]);
        expect(service.list).toBeCalled();
    });
  });

  describe('get', () => {
    it('should return one user', async () => {
        expect(await controller.get('id')).toEqual(mockUser);
        expect(service.get).toBeCalled();
    });
  });

  describe('create', () => {
    it('should create users', async () => {
        expect(await controller.create(createUserDto)).toEqual('1');
        expect(service.create).toBeCalled();
    });
  });
});
