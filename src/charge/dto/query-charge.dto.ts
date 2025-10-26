import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ChargeStatus, PaymentMethod } from '../schemas/charge.schema';

export class QueryChargeDto {
    @ApiPropertyOptional({
        description: 'Número da página',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Página deve ser um número inteiro' })
    @Min(1, { message: 'Página deve ser maior que 0' })
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Quantidade de itens por página',
        example: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Limite deve ser um número inteiro' })
    @Min(1, { message: 'Limite deve ser maior que 0' })
    @Max(100, { message: 'Limite deve ser menor que 100' })
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'ID do cliente',
        example: '507f1f77bcf86cd799439011',
    })
    @IsOptional()
    @IsString({ message: 'ID do cliente deve ser uma string' })
    customerId?: string;

    @ApiPropertyOptional({
        description: 'Status da cobrança',
        enum: ChargeStatus,
        example: ChargeStatus.PENDING,
    })
    @IsOptional()
    @IsEnum(ChargeStatus, { message: 'Status inválido' })
    status?: ChargeStatus;

    @ApiPropertyOptional({
        description: 'Método de pagamento',
        enum: PaymentMethod,
        example: PaymentMethod.PIX,
    })
    @IsOptional()
    @IsEnum(PaymentMethod, { message: 'Método de pagamento inválido' })
    paymentMethod?: PaymentMethod;
}
