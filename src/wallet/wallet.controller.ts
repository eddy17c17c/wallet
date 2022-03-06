import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/createWallet.dto';
import { CreateTransferDto } from './dto/createTransfer.dto';
import { WithdrawWalletDao } from './dao/withdrawWallet.dao';
import { logIO } from 'src/logger/logger.decorator';
import { Wallet } from './wallet.scehma';

@Controller('wallets')
export class WalletController {
    constructor(private readonly walletService: WalletService) {
    }

    @Post()
    @logIO()
    async create(@Body() dto: CreateWalletDto): Promise<string> {
        return this.walletService.create(dto);
    }

    @Post('/transfer')
    @logIO()
    async transfer(@Body() dto: CreateTransferDto): Promise<Boolean> {
        return this.walletService.transfer(dto);
    }

    @Put('/:id/withdraw')
    @logIO()
    async withdraw(@Param('id') id: string, @Body() dao: WithdrawWalletDao) {
        return this.walletService.withDraw(id, dao.amount);
    }

    @Get()
    @logIO()
    async get(): Promise<Wallet> {
        return this.walletService.list();
    }
}
