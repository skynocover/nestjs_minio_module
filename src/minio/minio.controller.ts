import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioDto } from './dto/create-minio.dto';
import { UpdateMinioDto } from './dto/update-minio.dto';

import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folderName: { type: 'string', nullable: false },
        fileName: { type: 'string', nullable: false },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() minioDto: MinioDto, @UploadedFile('file') file) {
    return this.minioService.create(minioDto, file);
  }

  @Get()
  findAll(@Query('recursive', ParseBoolPipe) recursive?: boolean) {
    return this.minioService.findAll(recursive);
  }

  @Get(':folder')
  findFolder(
    @Param('folder') folder?: string,
    @Query('recursive', ParseBoolPipe) recursive?: boolean,
  ) {
    return this.minioService.findFolder(folder, recursive);
  }

  @Patch('copy')
  update(@Body() updateMinioDto: UpdateMinioDto) {
    return this.minioService.copy(
      updateMinioDto.newPath,
      updateMinioDto.oldPath,
    );
  }

  @Patch('move')
  move(@Body() updateMinioDto: UpdateMinioDto) {
    return this.minioService.move(
      updateMinioDto.newPath,
      updateMinioDto.oldPath,
    );
  }

  @Delete(':path')
  remove(@Param('path') path: string) {
    return this.minioService.remove(path);
  }
}
