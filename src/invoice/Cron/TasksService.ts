import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Cache } from "cache-manager";
import { InvoiceService } from "../invoice.service";
import { log } from "console";
import { CalculateService } from "../utility/CalculateReport";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, of, timeout } from "rxjs";

@Injectable()
export class TasksServices {
  constructor(
    private hotelServices: InvoiceService,
    private calculateService: CalculateService,
    @Inject("DailyReport") private DailyReportRmq: ClientProxy
  ) {}

  private readonly logger = new Logger(TasksServices.name);
  @Cron("0 12 * * *") // "12:00 PM every day"
  // @Cron("10 * * * * *") //this is for test(develop)
  async handleCron() {
    log("corn start");
    let invoices = await this.hotelServices.getInvoices24HoursAgo();
    let all_price = this.calculateService.getSumItemSales(invoices);
    let soldItems = await this.calculateService.getReportSoldItems();
    let summary = this.calculateService.getSummaryReport(invoices);

    this.logger.debug("all_price ", all_price);
    this.logger.debug("countItems (grouped by SKU)", soldItems);
    this.logger.debug("summary ", summary);

    //send report for Consumer
    let res = await this.getDataFromEventClient(
      { cmd: "email" },
      { invoices: { all_price, soldItems, summary } },
      this.DailyReportRmq
    );
    //if res was not ok we can do somethis for run again the cornJob
    log(res);
  }

  async getDataFromEventClient(
    name: object,
    data: object,
    client: ClientProxy
  ): Promise<any> {
    return new Promise((resolve, rejects) => {
      client
        .send(name, data)
        .pipe(
          timeout(60000),
          map((res) => {
            resolve(res);
          }),
          catchError((err) => {
            log(err);
            return of(rejects(false));
          })
        )
        .subscribe();
    });
  }
}
