import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
import { Document } from "mongoose";

export type InvoiceDocument = Invoice & Document;

class Item {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @IsNotEmpty()
  qt: number;
}

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  customer: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @Prop({ required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @IsOptional()
  date: Date;

  @Prop({ type: [Object], required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}

const Invoice_Schema = SchemaFactory.createForClass(Invoice);

// Add an index to the 'date' field for get all invoice by date (24H)
Invoice_Schema.index({ date: 1 });
// Ascending index on 'items.sku'
Invoice_Schema.index({ "items.sku": 1 });

//or i can do this Combined Index
// InvoiceSchema.index({ date: 1, "items.sku": 1 });

Invoice_Schema.plugin(mongoosePaginate);
export const InvoiceSchema = Invoice_Schema;
