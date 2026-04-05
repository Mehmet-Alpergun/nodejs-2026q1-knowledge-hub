import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Article, ArticleStatus } from './entities/article.entity';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleQueryDto,
} from './dto/article.dto';

@Injectable()
export class ArticleService {
  private readonly articles = new Map<string, Article>();
  private commentService: any;
  setCommentService(svc: any) {
    this.commentService = svc;
  }

  findAll(query: ArticleQueryDto): Article[] {
    let results = Array.from(this.articles.values());
    // Optional filtering by status, categoryId, tag
    if (query.status)
      results = results.filter((a) => a.status === query.status);
    if (query.categoryId)
      results = results.filter((a) => a.categoryId === query.categoryId);
    if (query.tag) results = results.filter((a) => a.tags.includes(query.tag));
    return results;
  }

  findById(id: string): Article {
    const article = this.articles.get(id);
    if (!article) throw new NotFoundException(`Article "${id}" not found`);
    return article;
  }

  create(dto: CreateArticleDto): Article {
    const now = Date.now();
    const article: Article = {
      id: randomUUID(),
      title: dto.title,
      content: dto.content,
      status: dto.status ?? ArticleStatus.DRAFT,
      authorId: dto.authorId ?? null,
      categoryId: dto.categoryId ?? null,
      tags: dto.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(article.id, article);
    return article;
  }

  update(id: string, dto: UpdateArticleDto): Article {
    const article = this.findById(id);
    const updated = { ...article, ...dto, updatedAt: Date.now() };
    this.articles.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    this.findById(id);
    this.commentService?.deleteByArticle(id); // cascade delete comments
    this.articles.delete(id);
  }

  // Called by UserService when a user is deleted
  nullifyAuthor(authorId: string): void {
    this.articles.forEach((article, id) => {
      if (article.authorId === authorId) {
        this.articles.set(id, {
          ...article,
          authorId: null,
          updatedAt: Date.now(),
        });
      }
    });
  }

  // Called by CategoryService when a category is deleted
  nullifyCategory(categoryId: string): void {
    this.articles.forEach((article, id) => {
      if (article.categoryId === categoryId) {
        this.articles.set(id, {
          ...article,
          categoryId: null,
          updatedAt: Date.now(),
        });
      }
    });
  }
}
