import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great article!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'uuid-of-article' })
  @IsUUID()
  articleId: string;

  @ApiPropertyOptional({ example: 'uuid-of-author' })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
