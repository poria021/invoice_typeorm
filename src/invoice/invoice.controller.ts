import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { Invoice } from "./schemas/invoice.schema";
import { InvoicePaginationDto } from "./dto/invoice-pagination.dto";
import { UserService } from "./TypeormService";
import { User } from "./entity/user";
import { Invoice2 } from "./entity/invoicess";
import { InvoiceUpdateDto } from "./dto/invoice.schema.Dto";
import { MongoIdDTO } from "./dto/MongoId-dto";
import { log } from "console";

@Controller("invoice")
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private typeorm_Service: UserService
  ) {}

  @Get("all")
  async findAllt(): Promise<User[] | Invoice[]> {
    return this.typeorm_Service.findAll();
  }

  @Post("all")
  async create2(@Body() user: Partial<User>): Promise<User | Invoice2> {
    return this.typeorm_Service.create(user);
  }

  @Post()
  async create(@Body() createInvoiceDto: Invoice) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(":id")
  //if i use this user can send forexample customer:12 insted customer:<must be string>
  // async updateInvoice(@Body() data: Partial<Invoice>, @Param("id") id)
  //but its correct at all
  async updateInvoice(
    @Body() data: InvoiceUpdateDto,
    @Param() mongoid: MongoIdDTO
  ) {
    return this.invoiceService.update(mongoid.id, data);
  }

  @Get()
  async findAll(@Query() query: InvoicePaginationDto) {
    return this.invoiceService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param() mongoid: MongoIdDTO) {
    log(mongoid);
    return this.invoiceService.findOne(mongoid.id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.invoiceService.delete(id);
  }
}
