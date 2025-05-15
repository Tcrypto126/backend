import prisma from '../lib/prisma';
import { TransactionStatus, TransactionType } from '../generated/prisma';

export interface TransactionCreationAttrs {
  wallet_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status?: TransactionStatus;
  reference_id?: string;
  recipient_wallet_id?: string;
  description?: string;
}

export class TransactionModel {
  static async create(transactionData: TransactionCreationAttrs) {
    const { 
      wallet_id, 
      type, 
      amount, 
      currency, 
      status = TransactionStatus.PENDING,
      reference_id = null,
      recipient_wallet_id = null,
      description = null
    } = transactionData;
    
    return prisma.transaction.create({
      data: {
        type,
        amount,
        status,
        description
      }
    });
  }

  static async findById(id: string) {
    return prisma.transaction.findUnique({
      where: {
        id
      }
    });
  }

  static async updateStatus(id: string, status: TransactionStatus) {
    return prisma.transaction.update({
      where: {
        id
      },
      data: {
        status
      }
    });
  }

}