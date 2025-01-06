import { Entity, ObjectIdColumn, ObjectId, Column, Index } from "typeorm";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsDate,
  ValidateNested,
  IsOptional,
} from "class-validator";

class Item {
  @Column()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  qt: number;
}

@Entity("poria") // Specifies that the collection name is "poria"
export class Invoice2 {
  @ObjectIdColumn()
  //   id: ObjectId;
  id: any;

  @Column()
  @IsString()
  @IsNotEmpty()
  customer: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  reference: string;

  @Column({ type: "date" })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @IsOptional()
  date: Date;

  @Column(() => Item)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}

// // Indexes
// @Index("idx_date", ["date"]) // Index for "date" field
// @Index("idx_items_sku", ["items.sku"]) // Combined index on "items.sku"
export class InvoiceEntity2 {}
