import { INestApplication } from '@nestjs/common';
import { UserService } from './users/user.service';
import { ArticleService } from './articles/article.service';
import { CategoryService } from './categories/category.service';
import { CommentService } from './comments/comment.service';

// ── wireCascades ───────────────────────────────────────────────────────────
// NestJS DI creates each service in isolation. But our cascade delete logic
// requires services to call each other:
//   UserService.delete   → ArticleService.nullifyAuthor + CommentService.deleteByAuthor
//   CategoryService.delete → ArticleService.nullifyCategory
//   ArticleService.delete  → CommentService.deleteByArticle
//   CommentService.create  → ArticleService.findById (to validate articleId exists)
//
// We solve this by grabbing each service from the DI container AFTER the app
// is fully initialized, then injecting them via setter methods.
// This avoids circular import errors between modules.
export function wireCascades(app: INestApplication): void {
  const userService = app.get(UserService);
  const articleService = app.get(ArticleService);
  const categoryService = app.get(CategoryService);
  const commentService = app.get(CommentService);

  userService.setArticleService(articleService);
  userService.setCommentService(commentService);
  categoryService.setArticleService(articleService);
  articleService.setCommentService(commentService);
  commentService.setArticleService(articleService);
}
