import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, IsDateString } from "class-validator";

export class InvoicePaginationDto {
  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
