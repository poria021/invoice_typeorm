import { IsNumber, IsObject, IsArray, IsOptional } from 'class-validator';

export class PayTourDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  user_id: number;
}
