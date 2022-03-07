import { Test, TestingModule } from '@nestjs/testing';
import { CustomLogger } from '../logger/logger.service';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
          {
            provide: 'WalletService',
            useValue: {
                create: jest.fn(),
                transfer: jest.fn(),
                list: jest.fn(),
                withDraw: jest.fn(),
            }
          },
          {
            provide: CustomLogger,
            useValue: {
                log: jest.fn(),
                error: jest.fn(),
            }
        },
      ]
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
  });

  describe('create', () => {
    it('should create wallet', async () => {
        expect(await controller.create({} as any));
        expect(service.create).toBeCalled();
    });
  });

  describe('transfer', () => {
    it('should call transfer', async () => {
        expect(await controller.transfer({} as any));
        expect(service.transfer).toBeCalled();
    });
  });

  describe('withdraw', () => {
    it('should call withdraw', async () => {
        expect(await controller.withdraw('123', {} as any));
        expect(service.withDraw).toBeCalled();
    });
  });

  describe('list', () => {
    it('should call withdraw', async () => {
        expect(await controller.list());
        expect(service.list).toBeCalled();
    });
  });
});
