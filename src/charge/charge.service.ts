import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Charge, ChargeDocument, PaymentMethod } from './schemas/charge.schema';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { QueryChargeDto } from './dto/query-charge.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class ChargeService {
    constructor(
        @InjectModel(Charge.name) private chargeModel: Model<ChargeDocument>,
        private customerService: CustomerService,
    ) {}

    async create(createChargeDto: CreateChargeDto): Promise<Charge> {
        await this.customerService.findOne(createChargeDto.customerId);

        this.validatePaymentMethodData(createChargeDto.paymentMethod, createChargeDto.metadata);

        try {
        const charge = new this.chargeModel({
            ...createChargeDto,
            customerId: new Types.ObjectId(createChargeDto.customerId),
        });
        return await charge.save();
        } catch (error) {
        if (error.code === 11000) {
            throw new ConflictException('Chave de idempotência já utilizada');
        }
        throw error;
        }
    }

    async findAll(query: QueryChargeDto) {
        const { page = 1, limit = 10, customerId, status, paymentMethod } = query;
        const skip = (page - 1) * limit;

        const filter: any = {};
        
        if (customerId) {
        filter.customerId = new Types.ObjectId(customerId);
        }
        if (status) {
        filter.status = status;
        }
        if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
        }

        const [charges, total] = await Promise.all([
        this.chargeModel
            .find(filter)
            .populate('customerId', 'name email document phone')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec(),
        this.chargeModel.countDocuments(filter),
        ]);

        return {
        data: charges,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        };
    }

    async findOne(id: string): Promise<Charge> {
        const charge = await this.chargeModel
        .findById(id)
        .populate('customerId', 'name email document phone')
        .exec();
        
        if (!charge) {
        throw new NotFoundException('Cobrança não encontrada');
        }
        
        return charge;
    }

    async update(id: string, updateChargeDto: UpdateChargeDto): Promise<Charge> {
        const charge = await this.chargeModel
        .findByIdAndUpdate(id, updateChargeDto, { new: true })
        .populate('customerId', 'name email document phone')
        .exec();
        
        if (!charge) {
        throw new NotFoundException('Cobrança não encontrada');
        }
        
        return charge;
    }

    async remove(id: string): Promise<void> {
        const result = await this.chargeModel.findByIdAndDelete(id).exec();
        if (!result) {
        throw new NotFoundException('Cobrança não encontrada');
        }
    }

    async findByIdempotencyKey(idempotencyKey: string): Promise<Charge> {
        const charge = await this.chargeModel
        .findOne({ idempotencyKey })
        .populate('customerId', 'name email document phone')
        .exec();
        
        if (!charge) {
        throw new NotFoundException('Cobrança não encontrada');
        }
        
        return charge;
    }

    private validatePaymentMethodData(paymentMethod: PaymentMethod, metadata?: Record<string, any>) {
        switch (paymentMethod) {
        case PaymentMethod.BANK_SLIP:
            if (!metadata?.dueDate) {
            throw new BadRequestException('Data de vencimento é obrigatória para boleto bancário');
            }
            break;
        case PaymentMethod.CREDIT_CARD:
            if (!metadata?.installments || metadata.installments < 1 || metadata.installments > 12) {
            throw new BadRequestException('Número de parcelas deve estar entre 1 e 12 para cartão de crédito');
            }
            break;
        case PaymentMethod.PIX:
            break;
        default:
            throw new BadRequestException('Método de pagamento inválido');
        }
    }
}
