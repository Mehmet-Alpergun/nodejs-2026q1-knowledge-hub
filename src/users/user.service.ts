import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';

@Injectable()
export class UserService {
  // In-memory store: Map<userId, User>
  private readonly users = new Map<string, User>();

  // Lazy references to avoid circular imports (User ↔ Article ↔ Comment)
  private articleService: any;
  private commentService: any;
  setArticleService(svc: any) {
    this.articleService = svc;
  }
  setCommentService(svc: any) {
    this.commentService = svc;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findById(id: string): User {
    const user = this.users.get(id);
    if (!user) throw new NotFoundException(`User "${id}" not found`);
    return user;
  }

  create(dto: CreateUserDto): User {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      role: dto.role ?? UserRole.VIEWER,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  updatePassword(id: string, dto: UpdatePasswordDto): User {
    const user = this.findById(id);
    if (user.password !== dto.oldPassword)
      throw new ForbiddenException('Old password is incorrect');
    const updated = {
      ...user,
      password: dto.newPassword,
      updatedAt: Date.now(),
    };
    this.users.set(id, updated);
    return updated;
  }

  delete(id: string): void {
    this.findById(id);
    this.articleService?.nullifyAuthor(id); // set articles.authorId → null
    this.commentService?.deleteByAuthor(id); // delete user's comments
    this.users.delete(id);
  }
}
