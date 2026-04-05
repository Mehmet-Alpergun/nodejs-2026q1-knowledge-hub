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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { ParseUuidPipe } from '../common/pipes/parse-uuid.pipe';
import { ExcludePasswordInterceptor } from '../common/interceptors/exclude-password.interceptor';

@ApiTags('Users')
@Controller('user')
@UseInterceptors(ExcludePasswordInterceptor) // strips password from ALL responses here
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseUuidPipe) id: string) {
    // ParseUuidPipe runs first — throws 400 if :id is not a valid UUID
    return this.userService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 403, description: 'Wrong old password' })
  updatePassword(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 = success, no response body
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id', ParseUuidPipe) id: string) {
    this.userService.delete(id);
  }
}
