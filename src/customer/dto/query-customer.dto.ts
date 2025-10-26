import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCustomerDto {
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
        description: 'Termo de busca (nome, email ou documento)',
        example: 'João',
    })
    @IsOptional()
    @IsString({ message: 'Busca deve ser uma string' })
    search?: string;
}
