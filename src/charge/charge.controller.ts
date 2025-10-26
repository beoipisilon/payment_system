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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { QueryChargeDto } from './dto/query-charge.dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@ApiTags('charges')
@Controller('charges')
export class ChargeController {
    constructor(private readonly chargeService: ChargeService) {}

    @Post()
    @UseInterceptors(IdempotencyInterceptor)
    @ApiOperation({ summary: 'Criar nova cobrança' })
    @ApiResponse({ status: 201, description: 'Cobrança criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    @ApiResponse({ status: 409, description: 'Chave de idempotência já utilizada' })
    async create(@Body() createChargeDto: CreateChargeDto) {
        const charge = await this.chargeService.create(createChargeDto);
        return {
        success: true,
        data: charge,
        message: 'Cobrança criada com sucesso',
        };
    }

    @Get()
    @ApiOperation({ summary: 'Listar cobranças' })
    @ApiResponse({ status: 200, description: 'Lista de cobranças retornada com sucesso' })
    async findAll(@Query() query: QueryChargeDto) {
        const result = await this.chargeService.findAll(query);
        return {
            success: true,
            data: result,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar cobrança por ID' })
    @ApiResponse({ status: 200, description: 'Cobrança encontrada' })
    @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
    async findOne(@Param('id') id: string) {
        const charge = await this.chargeService.findOne(id);
        return {
            success: true,
            data: charge,
        };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar cobrança' })
    @ApiResponse({ status: 200, description: 'Cobrança atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
    async update(
        @Param('id') id: string,
        @Body() updateChargeDto: UpdateChargeDto,
    ) {
        const charge = await this.chargeService.update(id, updateChargeDto);
        return {
        success: true,
            data: charge,
            message: 'Cobrança atualizada com sucesso',
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remover cobrança' })
    @ApiResponse({ status: 200, description: 'Cobrança removida com sucesso' })
    @ApiResponse({ status: 404, description: 'Cobrança não encontrada' })
    async remove(@Param('id') id: string) {
        await this.chargeService.remove(id);
        return {
            success: true,
            message: 'Cobrança removida com sucesso',
        };
    }
}
