import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from './wallet.scehma';
import { Model } from 'mongoose';
import { CreateWalletDto } from './dto/createWallet.dto';
import { CreateTransferDto } from './dto/createTransfer.dto';
import { TransactionLogService } from '../transactionLog/transactionLog.service';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
        private readonly transactionLogService: TransactionLogService,
    ) {}

    async create(dto: CreateWalletDto): Promise<string> {
        const wallet = await this.walletModel.create(dto);

        return wallet._id;
    }

    async _beforeTransfer(dto: CreateTransferDto): Promise<Model<WalletDocument>[]>{
        const { from, to, amount } = dto;
        let fromWallet, toWallet = null;

        if (!to) {
            throw new Error('Must have recipient');
        }

        if (amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        if (from) {
            fromWallet = await this.walletModel.findById(from).exec();
            if (fromWallet.balance <= amount) {
                throw new Error('Insufficient balance');
            }
        }

        toWallet = await this.walletModel.findById(to).exec();
        if (!toWallet) { throw new Error('Wallet not found'); }

        return [fromWallet, toWallet];
    }

    async transfer(dto: CreateTransferDto): Promise<Boolean> {
        const [fromWallet, toWallet] = await this._beforeTransfer(dto);

        if (fromWallet) {
            fromWallet.balance -= dto.amount;
            await fromWallet.save();
        }

        toWallet.balance += dto.amount;
        await toWallet.save();

        await this.transactionLogService.create({
            ...(fromWallet && { from: fromWallet._id }),
            to: toWallet._id,
            action: fromWallet ? 'deposit' : 'transfer',
            amount: dto.amount,
            currency: toWallet.currency,
            executedAt: new Date(),
        })

        return true;
    }

    async list(): Promise<Wallet> {
        return this.walletModel.find();
    }

    async withDraw(id: string, amount: number): Promise<Wallet> {
        const wallet = await this.walletModel.findById(id).exec();
        if (wallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        wallet.balance -= amount;
        const res = await wallet.save();

        await this.transactionLogService.create({
            to: wallet._id,
            action: 'withdraw',
            amount,
            currency: wallet.currency,
            executedAt: new Date(),
        })

        return res;
    }
}
