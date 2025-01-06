import {
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
  IsMongoId,
} from "class-validator";

export class MongoIdDTO {
  @IsMongoId()
  id: number;
}
