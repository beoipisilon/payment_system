import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = new this.customerModel(createCustomerDto);
      return await customer.save();
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`${field} já está em uso`);
      }
      throw error;
    }
  }

  async findAll(query: QueryCustomerDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { document: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      this.customerModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.customerModel.countDocuments(filter),
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      const customer = await this.customerModel
        .findByIdAndUpdate(id, updateCustomerDto, { new: true })
        .exec();
      
      if (!customer) {
        throw new NotFoundException('Cliente não encontrado');
      }
      
      return customer;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`${field} já está em uso`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Cliente não encontrado');
    }
  }
}
