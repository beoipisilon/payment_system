import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ChargeService } from '../../charge/charge.service';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private chargeService: ChargeService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.body?.idempotencyKey;

        if (!idempotencyKey) {
        return next.handle();
        }

        try {
        const existingCharge = await this.chargeService.findByIdempotencyKey(idempotencyKey);
        
        if (existingCharge) {
            return new Observable(subscriber => {
            subscriber.next({
                success: true,
                data: existingCharge,
                message: 'Operação já processada anteriormente',
            });
            subscriber.complete();
            });
        }
        } catch (error) {
        if (error.status !== 404) {
            throw error;
        }
        }

        return next.handle();
    }
}
