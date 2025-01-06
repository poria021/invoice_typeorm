import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import mongoose, { Model, PaginateModel } from "mongoose";
import { Invoice, InvoiceDocument } from "./schemas/invoice.schema";
import { InvoicePaginationDto } from "./dto/invoice-pagination.dto";
import { log } from "console";
import { MongoIdDTO } from "./dto/MongoId-dto";
import { InvoiceUpdateDto } from "./dto/invoice.schema.Dto";
@Injectable()
export class InvoiceService {
  constructor(
    // private config: ConfigService,

    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument> &
      PaginateModel<InvoiceDocument>,
    @InjectModel(User.name) private userModel?: Model<User>
  ) {}
  private logger = new Logger(InvoiceService.name);

  async create(invoice: Invoice): Promise<Invoice> {
    // invoice.date = new Date();
    // return this.invoiceModel.create(invoice);

    //or
    const createdInvoice = new this.invoiceModel({
      ...invoice,
      date: new Date(),
    });
    createdInvoice.customer = "pori1";
    return createdInvoice.save();
  }

  async update(id: MongoIdDTO, data: InvoiceUpdateDto) {
    // let isValid = mongoose.isValidObjectId(id);
    // if (!isValid) throw new BadRequestException("id not found");
    return this.invoiceModel.findByIdAndUpdate(id.id, data);
  }

  async findAll(filters: InvoicePaginationDto) {
    const { customer, startDate, endDate, page = 1, limit = 10 } = filters;
    const query: Record<string, any> = {};

    if (customer) {
      query.customer = { $regex: customer, $options: "i" };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    return this.invoiceModel.paginate(query, {
      page,
      limit,
      sort: { date: -1 },
    });
  }

  async findOne(id: MongoIdDTO): Promise<Invoice> {
    // let isValid = mongoose.isValidObjectId(id);
    // if (!isValid) throw new BadRequestException("id not found");
    return this.invoiceModel.findById(id.id).exec();
  }

  async delete(id: string): Promise<Invoice> {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }

  async getInvoices24HoursAgo(): Promise<InvoiceDocument[]> {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(
      currentDate.getTime() - 24 * 60 * 60 * 1000
    ); // 24 hours ago

    // Find invoices created within the last 24 hours
    return this.invoiceModel
      .find({ date: { $gte: twentyFourHoursAgo } })
      .exec();
  }
}
