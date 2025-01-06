import { Module, ValidationPipe, MiddlewareConsumer } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
const redisStore = require("cache-manager-redis-store");
import type { RedisClientOptions } from "redis";
import { CacheModule } from "@nestjs/cache-manager";
import typeorm from "./config/typeorm";
import { InvoiceModule } from "./invoice/invoice.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { User } from "./invoice/entity/user";
import { Invoice } from "./invoice/schemas/invoice.schema";
import { Invoice2 } from "./invoice/entity/invoicess";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [typeorm],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MongoDBUrl"),
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRoot({
      type: "mongodb",
      host: "localhost",
      port: 27017,
      database: "invoices",
      // synchronize: true,
      useUnifiedTopology: true,
      entities: [User, Invoice2],
    }),
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
