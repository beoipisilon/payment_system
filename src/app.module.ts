import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { ChargeModule } from './charge/charge.module';

@Module({
    imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/payment_system'),
        CustomerModule,
        ChargeModule,
    ],
})
export class AppModule {}
