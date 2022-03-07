import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    owner: User;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);