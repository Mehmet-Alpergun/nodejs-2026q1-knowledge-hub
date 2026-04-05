import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleQueryDto,
} from './dto/article.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('Articles')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all articles (filterable by status, categoryId, tag)',
  })
  findAll(@Query() query: ArticleQueryDto) {
    // @Query() binds ?status=published&tag=nodejs to ArticleQueryDto
    return this.articleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.articleService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create article' })
  create(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update article' })
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  remove(@Param('id', ParseUuidPipe) id: string) {
    this.articleService.delete(id);
  }
}
