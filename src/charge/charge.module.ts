import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';
import { Charge, ChargeSchema } from './schemas/charge.schema';
import { CustomerModule } from '../customer/customer.module';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Charge.name, schema: ChargeSchema }]),
        CustomerModule,
    ],
    controllers: [ChargeController],
    providers: [ChargeService, IdempotencyInterceptor],
    exports: [ChargeService],
})
export class ChargeModule {}
