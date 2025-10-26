import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
    @Prop({ required: true, trim: true, maxlength: 100 })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true, unique: true, trim: true })
    document: string;

    @Prop({ required: true, trim: true })
    phone: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);