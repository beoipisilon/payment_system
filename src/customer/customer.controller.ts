import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    @ApiOperation({ summary: 'Criar novo cliente' })
    @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
    @ApiResponse({ status: 409, description: 'E-mail ou documento já cadastrado' })
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        const customer = await this.customerService.create(createCustomerDto);
        return {
            success: true,
            data: customer,
            message: 'Cliente criado com sucesso',
        };
    }

    @Get()
    @ApiOperation({ summary: 'Listar clientes' })
    @ApiResponse({ status: 200, description: 'Lista de clientes retornada com sucesso' })
    async findAll(@Query() query: QueryCustomerDto) {
        const result = await this.customerService.findAll(query);
        return {
            success: true,
            data: result,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar cliente por ID' })
    @ApiResponse({ status: 200, description: 'Cliente encontrado' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    async findOne(@Param('id') id: string) {
        const customer = await this.customerService.findOne(id);
        return {
            success: true,
            data: customer,
        };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar cliente' })
    @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    @ApiResponse({ status: 409, description: 'E-mail ou documento já cadastrado' })
    async update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        const customer = await this.customerService.update(id, updateCustomerDto);
        return {
            success: true,
            data: customer,
            message: 'Cliente atualizado com sucesso',
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remover cliente' })
    @ApiResponse({ status: 200, description: 'Cliente removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    async remove(@Param('id') id: string) {
        await this.customerService.remove(id);
            return {
            success: true,
            message: 'Cliente removido com sucesso',
        };
    }
}
