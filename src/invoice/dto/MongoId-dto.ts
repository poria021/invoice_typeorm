import {
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
  IsMongoId,
  isString,
  IsString,
} from "class-validator";

export class MongoIdDTO {
  @IsMongoId()
  @IsString()
  id: string;
}
