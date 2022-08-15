import { ApiProperty } from '@nestjs/swagger';
// use global pipe in main or custom pipe in module
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMinioDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPath: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  oldPath: string;
}
