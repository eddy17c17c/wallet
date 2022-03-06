import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) {}

  async list(): Promise<User[]>{
    return this.userModel.find().exec();
  }

  async get(id: string): Promise<User> {
      return this.userModel.findById(id).exec();
  }

  async create(dto: CreateUserDto): Promise<string> {
      const user = await this.userModel.create(dto);

      return user._id;
  }
}
