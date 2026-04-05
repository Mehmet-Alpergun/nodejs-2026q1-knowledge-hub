import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  @ApiProperty({ example: 'Getting started with NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'NestJS is a framework...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ enum: ArticleStatus, default: ArticleStatus.DRAFT })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional({ example: 'uuid-of-author' })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: ['nestjs', 'nodejs'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateArticleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiPropertyOptional({ enum: ArticleStatus })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class ArticleQueryDto {
  @ApiPropertyOptional({ enum: ArticleStatus })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;
}
