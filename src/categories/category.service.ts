import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  private readonly categories = new Map<string, Category>();
  private articleService: any;
  setArticleService(svc: any) {
    this.articleService = svc;
  }

  findAll(): Category[] {
    return Array.from(this.categories.values());
  }

  findById(id: string): Category {
    const cat = this.categories.get(id);
    if (!cat) throw new NotFoundException(`Category "${id}" not found`);
    return cat;
  }

  create(dto: CreateCategoryDto): Category {
    const category: Category = { id: randomUUID(), ...dto };
    this.categories.set(category.id, category);
    return category;
  }

  update(id: string, dto: UpdateCategoryDto): Category {
    const category = this.findById(id);
    const updated = { ...category, ...dto };
    this.categories.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    this.findById(id);
    this.articleService?.nullifyCategory(id); // set articles.categoryId → null
    this.categories.delete(id);
  }
}
