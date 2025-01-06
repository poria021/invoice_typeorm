import { Test, TestingModule } from "@nestjs/testing";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";
import { Invoice } from "./schemas/invoice.schema";
import { InvoicePaginationDto } from "./dto/invoice-pagination.dto";
import { MongoIdDTO } from "./dto/MongoId-dto";

describe("InvoiceController", () => {
  let controller: InvoiceController;
  let invoice = <Invoice>{},
    invoices = <Invoice[]>[],
    query = <InvoicePaginationDto>{},
    id: MongoIdDTO = { id: "67766c45d5d62739fef7f3c4" };
  const invoiceServicesMock = {
    create: jest.fn((dto) => invoice),
    findOne: jest.fn((dto) => invoice),
    update: jest.fn().mockImplementation((id, dto) => {
      return invoice;
    }),
    findAll: jest.fn((dto) => {
      return invoices;
    }),
    delete: jest.fn((dto) => invoice),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [InvoiceService],
    })
      .overrideProvider(InvoiceService)
      .useValue(invoiceServicesMock)
      .compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create invoice", async () => {
    expect(await controller.create(invoice)).toEqual(
      // id: expect.any(Number),
      invoice
    );
  });

  it("should update invoice", async () => {
    expect(await controller.updateInvoice(invoice, id)).toEqual(
      // id: expect.any(Number),
      invoice
    );
  });

  it("shoud be return an invoice", async () => {
    expect(await controller.findOne(id)).toEqual(invoice);
  });

  it("shoud be return [] of invoice", async () => {
    expect(await controller.findAll(query)).toEqual(invoices);
  });

  it("shoud be delete an invoice", async () => {
    expect(await controller.delete(id.id)).toEqual(invoice);
  });
});
