import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsDate,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class Item {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @IsNotEmpty()
  qt: number;
}

@Schema({ timestamps: true })
export class InvoiceUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  customer: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  reference: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @IsOptional()
  date: Date;

  @Prop({ type: [Object], required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  @IsOptional()
  items: Item[];
}
