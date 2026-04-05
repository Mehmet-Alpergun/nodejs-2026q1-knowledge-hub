import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.categoryService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id', ParseUuidPipe) id: string) {
    this.categoryService.delete(id);
  }
}
