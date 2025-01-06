import { Module } from "@nestjs/common";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { User as users } from "./entity/user";
import { Invoice, InvoiceSchema } from "./schemas/invoice.schema";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksServices } from "./Cron/TasksService";
import { CalculateService } from "./utility/CalculateReport";
import { UserService } from "./TypeormService";
import { In } from "typeorm";
import { Invoice2 } from "./entity/invoicess";
require("dotenv").config();
@Module({
  imports: [
    TypeOrmModule.forFeature([users, Invoice2]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: "DailyReport",
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>(
                "RMQ_USER"
              )}:${configService.get<string>(
                "RMQ_PASSWORD"
              )}@${configService.get<string>(
                "RMQ_HOST"
              )}:${configService.get<string>("RMQ_PORT")}`,
            ],
            queue: configService.get<string>("RMQ_QReport"),
            queueOptions: {
              durable: JSON.parse(
                configService.get("RMQ_PRODUCER_QUEUE_DURABLE")
              ),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, TasksServices, CalculateService, UserService],
})
export class InvoiceModule {}
