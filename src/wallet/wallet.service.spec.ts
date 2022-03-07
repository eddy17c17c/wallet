import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Wallet } from './wallet.schema';
import { CreateWalletDto } from './dto/createWallet.dto';
import { CreateTransferDto } from './dto/createTransfer.dto';
import { TransactionLogService } from '../transactionLog/transactionLog.service';

describe('WalletService', () => {
  let service: WalletService;
  let logService: TransactionLogService;
  let model: Model<Wallet>;

  const createWalletDto: CreateWalletDto = {
      owner: 'bob',
      currency: 'HKD',
  };

  const mockWallet = {
      _id: '1',
      owner: 'bob',
      currency: 'HKD',
      balance: 100,
      save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          WalletService,
        {
            provide: getModelToken('Wallet'),
            useValue: {
              new: jest.fn().mockResolvedValue(mockWallet),
              constructor: jest.fn().mockResolvedValue(mockWallet),
              find: jest.fn(),
              findById: jest.fn().mockResolvedValue(mockWallet),
              create: jest.fn(),
              exec: jest.fn(),
            },
        },
        {
            provide: 'TransactionLogService',
            useValue: {
                create: jest.fn()
            }
        }
    ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    logService = module.get<TransactionLogService>(TransactionLogService);
    model = module.get<Model<Wallet>>(getModelToken('Wallet'));
  });

  describe('create', () => {
    it('should call create', async () => {
        jest.spyOn(model, 'create').mockImplementationOnce(() => mockWallet);

        await service.create(createWalletDto);

        expect(model.create).toBeCalled();
    });
  });

  describe('transfer', () => {
    it('should throw error if to missing', async () => {
        try {
            await service.transfer({
                from: 'alice',
                amount: 123,
            } as any);
        } catch(e) {
            expect(e.message).toEqual('Must have recipient');
        }
    });

    it('should throw error if amount <= 0', async () => {
        try {
            await service.transfer({
                to: 'bob',
                from: 'alice',
                amount: 0,
            } as any);
        } catch(e) {
            expect(e.message).toEqual('Amount must be greater than zero');
        }

    });

    it('should throw error if insufficient balance', async () => {
        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(mockWallet),
        });

        try {
            await service.transfer({
                to: 'bob',
                from: 'alice',
                amount: 100000,
            } as any)
        } catch(e) {
            expect(e.message).toEqual('Insufficient balance');
        }
    });

    it('should throw Wallet not found', async () => {
        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(mockWallet),
        });

        try {
            await service.transfer({
                to: 'bob',
                from: 'alice',
                amount: 5,
            });
        } catch(e) {
            expect(e.message).toEqual('Wallet not found');
        }
    });

    it('should pass', async () => {
        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockWallet),
        });

        await service.transfer({
            to: 'bob',
            from: 'alice',
            amount: 5,
        });

        expect(mockWallet.save).toHaveBeenCalledTimes(2);
        expect(logService.create).toHaveBeenCalled();

        mockWallet.save.mockReset();
    });
  });

  describe('withDraw', () => {
      it('should throw insufficient balance', async () => {
        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockWallet),
        });

        try {
            await service.withDraw('id', 5000);
        } catch (e) {
            expect(e.message).toEqual('Insufficient balance');
        }
    });


    it('should be able to withdraw', async () => {
        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockWallet),
        });

        await service.withDraw('id', 50);
        expect(mockWallet.save).toHaveBeenCalledTimes(1);
        expect(logService.create).toHaveBeenCalled(); 
    });
  });
});
