import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { ChargeStatus } from '../schemas/charge.schema';

    export class UpdateChargeDto {
    @ApiProperty({
        description: 'Status da cobrança',
        enum: ChargeStatus,
        example: ChargeStatus.PAID,
        required: false,
    })
    @IsOptional()
    @IsEnum(ChargeStatus, { message: 'Status inválido' })
    status?: ChargeStatus;

    @ApiProperty({
        description: 'Dados específicos do método de pagamento',
        example: { transactionId: 'tx_123456' },
        required: false,
    })
    @IsOptional()
    @IsObject({ message: 'Metadados devem ser um objeto' })
    metadata?: Record<string, any>;
}
