import { ApiProperty } from '@nestjs/swagger';
// use global pipe in main or custom pipe in module
import { IsBoolean } from 'class-validator';

export class MinioQueryDTO {
  @ApiProperty({
    description: 'recursive or not',
  })
  @IsBoolean()
  recursive: boolean;
}
