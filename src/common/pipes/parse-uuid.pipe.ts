import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUuid } from 'uuid';

// Validates that a route param like :id is a valid UUID.
// Used as: @Param('id', ParseUuidPipe) id: string
// Throws 400 automatically if the value is not a UUID.
@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isUuid(value))
      throw new BadRequestException(`"${value}" is not a valid UUID`);
    return value;
  }
}
