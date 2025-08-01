import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  rating: number;

  @IsBoolean()
  inStock: boolean;

  @IsBoolean()
  isNew: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  variations?: string[];
}
