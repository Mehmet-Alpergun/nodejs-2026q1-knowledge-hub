import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Node.js' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Articles about Node.js' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Node.js Updated' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
