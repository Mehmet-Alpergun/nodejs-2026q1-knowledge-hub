import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { ArticleModule } from './articles/article.module';
import { CategoryModule } from './categories/category.module';
import { CommentModule } from './comments/comment.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env into process.env
    UserModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
  ],
})
export class AppModule implements NestModule {
  // Registers LoggingMiddleware for ALL routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
