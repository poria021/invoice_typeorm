import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Invoice, InvoiceDocument } from "../schemas/invoice.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CalculateService {
  constructor(
    private config: ConfigService,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>
  ) {}

  getSumItemSales(invoices: InvoiceDocument[]): number {
    //we can do any thing here .......
    //i just sum(amount)
    let lastPrice = 0;
    invoices.forEach((item) => {
      lastPrice += item.amount;
    });
    return lastPrice;
  }
  async getReportSoldItems(): Promise<any> {
    //we can do any thing here .......
    //i just (grouped by SKU).

    return this.invoiceModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.sku",
          totalQuantity: { $sum: "$items.qt" },
        },
      },
      { $project: { _id: 0, sku: "$_id", totalQuantity: 1 } },
    ]);
  }

  getSummaryReport(invoices: InvoiceDocument[]): string {
    //we can do any thing here .......
    //i just create string
    let ourProducts = "this is our sailes today : ";
    invoices.forEach((item, index) => {
      ourProducts += ` ${index} :   `;
      item.items.forEach((productName) => {
        ourProducts += ` ${productName.sku}  `;
      });
    });
    return ourProducts;
  }
}
