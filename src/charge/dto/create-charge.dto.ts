import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsUUID, Min, Max, MaxLength, IsObject, ValidateIf } from 'class-validator';
import { PaymentMethod } from '../schemas/charge.schema';

export class CreateChargeDto {
    @ApiProperty({
        description: 'ID do cliente',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString({ message: 'ID do cliente deve ser uma string' })
    customerId: string;

    @ApiProperty({
        description: 'Valor da cobrança',
        example: 100.50,
        minimum: 0.01,
    })
    @IsNumber({}, { message: 'Valor deve ser um número' })
    @Min(0.01, { message: 'Valor deve ser maior que 0' })
    amount: number;

    @ApiProperty({
        description: 'Moeda da cobrança',
        example: 'BRL',
        default: 'BRL',
    })
    @IsOptional()
    @IsString({ message: 'Moeda deve ser uma string' })
    @MaxLength(3, { message: 'Moeda deve ter no máximo 3 caracteres' })
    currency?: string = 'BRL';

    @ApiProperty({
        description: 'Método de pagamento',
        enum: PaymentMethod,
        example: PaymentMethod.PIX,
    })
    @IsEnum(PaymentMethod, { message: 'Método de pagamento inválido' })
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: 'Descrição da cobrança',
        example: 'Pagamento de serviços',
        required: false,
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: 'Descrição deve ser uma string' })
    @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
    description?: string;

    @ApiProperty({
        description: 'Dados específicos do método de pagamento',
        example: { installments: 3 },
        required: false,
    })
    @IsOptional()
    @IsObject({ message: 'Metadados devem ser um objeto' })
    metadata?: Record<string, any>;

    @ApiProperty({
        description: 'Chave de idempotência (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID(4, { message: 'Chave de idempotência deve ser um UUID válido' })
    idempotencyKey: string;
}

export class CreateChargeValidationDto extends CreateChargeDto {
    @ValidateIf((o) => o.paymentMethod === 'BANK_SLIP')
    @IsString({ message: 'Data de vencimento é obrigatória para boleto bancário' })
    dueDate?: string;

    @ValidateIf((o) => o.paymentMethod === 'CREDIT_CARD')
    @IsNumber({}, { message: 'Número de parcelas deve ser um número' })
    @Min(1, { message: 'Número de parcelas deve ser maior que 0' })
    @Max(12, { message: 'Número de parcelas deve ser menor que 12' })
    installments?: number;
}
