import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet, WalletSchema } from './wallet.schema';
import { LoggerModule } from '../logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLogModule } from '../transactionLog/transactionLog.module';

@Module({
    imports: [
        LoggerModule,
        MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
        TransactionLogModule,
    ],
    controllers: [WalletController],
    providers: [WalletService],
})

export class WalletModule {}
