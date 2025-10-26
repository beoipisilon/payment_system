import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty({
        description: 'Nome completo do cliente',
        example: 'João Silva',
        minLength: 2,
        maxLength: 100,
    })
    @IsString({ message: 'Nome deve ser uma string' })
    @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'E-mail do cliente',
        example: 'joao.silva@email.com',
    })
    @IsEmail({}, { message: 'E-mail inválido' })
    email: string;

    @ApiProperty({
        description: 'CPF ou CNPJ do cliente',
        example: '12345678901',
        minLength: 11,
        maxLength: 14,
    })
    @IsString({ message: 'Documento deve ser uma string' })
    @MinLength(11, { message: 'Documento deve ter pelo menos 11 caracteres' })
    @MaxLength(14, { message: 'Documento deve ter no máximo 14 caracteres' })
    @Matches(/^\d+$/, { message: 'Documento deve conter apenas números' })
    document: string;

    @ApiProperty({
        description: 'Telefone do cliente',
        example: '11999999999',
        minLength: 10,
        maxLength: 15,
    })
    @IsString({ message: 'Telefone deve ser uma string' })
    @MinLength(10, { message: 'Telefone deve ter pelo menos 10 caracteres' })
    @MaxLength(15, { message: 'Telefone deve ter no máximo 15 caracteres' })
    phone: string;
}
