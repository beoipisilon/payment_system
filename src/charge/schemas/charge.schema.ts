import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChargeDocument = Charge & Document;

export enum PaymentMethod {
    PIX = 'PIX',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_SLIP = 'BANK_SLIP',
}

export enum ChargeStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Charge {
    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customerId: Types.ObjectId;

    @Prop({ required: true, min: 0.01 })
    amount: number;

    @Prop({ default: 'BRL', maxlength: 3 })
    currency: string;

    @Prop({ enum: PaymentMethod, required: true })
    paymentMethod: PaymentMethod;

    @Prop({ enum: ChargeStatus, default: ChargeStatus.PENDING })
    status: ChargeStatus;

    @Prop({ maxlength: 500 })
    description?: string;

    @Prop({ type: Object })
    metadata?: Record<string, any>;

    @Prop({ required: true, unique: true })
    idempotencyKey: string;
}

export const ChargeSchema = SchemaFactory.createForClass(Charge);
