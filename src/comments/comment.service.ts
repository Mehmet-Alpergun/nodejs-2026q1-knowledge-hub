import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  private readonly comments = new Map<string, Comment>();
  private articleService: any;
  setArticleService(svc: any) {
    this.articleService = svc;
  }

  findByArticle(articleId: string): Comment[] {
    return Array.from(this.comments.values()).filter(
      (c) => c.articleId === articleId,
    );
  }

  create(dto: CreateCommentDto): Comment {
    // 422 Unprocessable Entity if the referenced article doesn't exist
    try {
      this.articleService?.findById(dto.articleId);
    } catch {
      throw new UnprocessableEntityException(
        `Article "${dto.articleId}" does not exist`,
      );
    }

    const comment: Comment = {
      id: randomUUID(),
      content: dto.content,
      articleId: dto.articleId,
      authorId: dto.authorId ?? null,
      createdAt: Date.now(),
    };
    this.comments.set(comment.id, comment);
    return comment;
  }

  delete(id: string): void {
    if (!this.comments.has(id))
      throw new NotFoundException(`Comment "${id}" not found`);
    this.comments.delete(id);
  }

  // Called by UserService when a user is deleted
  deleteByAuthor(authorId: string): void {
    this.comments.forEach((comment, id) => {
      if (comment.authorId === authorId) this.comments.delete(id);
    });
  }

  // Called by ArticleService when an article is deleted
  deleteByArticle(articleId: string): void {
    this.comments.forEach((comment, id) => {
      if (comment.articleId === articleId) this.comments.delete(id);
    });
  }
}
