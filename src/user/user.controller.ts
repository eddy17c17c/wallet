import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { logIO } from '../logger/logger.decorator';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
        this.userService = userService;
    }

    @Get()
    @logIO()
    async list(): Promise<User[]> {
        return this.userService.list();
    }

    @Get('/:id')
    @logIO()
    async get(@Param('id') id: string): Promise<User> {
        return this.userService.get(id);
    }

    @Post()
    @logIO()
    async create(@Body() user: CreateUserDto): Promise<string> {
        return this.userService.create(user);
    }
}