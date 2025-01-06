import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { InvoiceService } from "./invoice.service";
import { Invoice } from "./schemas/invoice.schema";
import { Model } from "mongoose";
import { getRepositoryToken } from "@nestjs/typeorm";
import { In } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { log } from "console";

describe("InvoiceService", () => {
  let service: InvoiceService;
  let model: Model<Invoice>;

  const mockInvoiceModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    },
    mockUsersRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: getModelToken("Invoice"), useValue: mockInvoiceModel },
        { provide: getModelToken("User"), useValue: mockInvoiceModel },
        // { provide: ConfigService},
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken("Invoice"));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const mockInvoiceModel = jest.fn(); // Mock as a constructor function
    let service: InvoiceService;
    beforeEach(() => {
      // Mock the `save` method on instances created by the constructor
      mockInvoiceModel.mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data), // Simulate `save` returning the data
      }));

      service = new InvoiceService(mockInvoiceModel as any);
    });

    it("should create and save a new invoice", async () => {
      const invoiceData = { customer: "John Doe", amount: 100 } as Invoice;
      const expectedInvoice = {
        ...invoiceData,
        date: expect.any(Date),
      };

      const result = await service.create(invoiceData);
      log("result : ", result);
      // Assertions
      expect(mockInvoiceModel).toHaveBeenCalledWith(
        expect.objectContaining(invoiceData)
      );
      expect(result).toEqual(expectedInvoice);
    });

    // it("should create and save a new invoice", async () => {
    //   const invoiceData = { customer: "John Doe", amount: 100 } as Invoice;
    //   const expectedInvoice = {
    //     ...invoiceData,
    //     date: expect.any(Date),
    //   };

    //   mockInvoiceModel.create.mockReturnValue(expectedInvoice);

    //   const result = await service.create(invoiceData);
    //   log("result : ", result);

    //   expect(model.create).toHaveBeenCalledWith(
    //     expect.objectContaining(invoiceData)
    //   );
    //   expect(result).toEqual(expectedInvoice);
    // });
  });

  // describe("findAll", () => {
  //   it("should retrieve all invoices", async () => {
  //     let id = "6771a7925d779d3f5dfc0d28";
  //     const mockInvoices = [
  //       { customerName: "poria rashnu", amount: 100, date: new Date() },
  //       { customerName: "john rashnu", amount: 150, date: new Date() },
  //     ];

  //     mockInvoiceModel.find.mockReturnValue(mockInvoices);

  //     const result = await service.findOne(id);

  //     expect(model.find).toHaveBeenCalled();
  //     expect(result).toEqual(mockInvoices);
  //   });
  // });
});
