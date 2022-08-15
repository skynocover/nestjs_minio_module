import { ApiProperty } from '@nestjs/swagger';
// use global pipe in main or custom pipe in module
import { IsNotEmpty, IsString } from 'class-validator';

export class MinioDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  folderName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileName: string;
}
