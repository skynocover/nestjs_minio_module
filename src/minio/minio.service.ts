import { Injectable } from '@nestjs/common';
import { MinioDto } from './dto/create-minio.dto';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  MINIO: Minio.Client;
  bucketName: string;
  constructor(private configService: ConfigService) {
    const endPoint = this.configService.get('MINIO_END_POINT');
    const accessKey = this.configService.get('MINIO_API_ACCESS_KEY');
    const secretKey = this.configService.get('MINIO_API_SECRET_KEY');
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
    this.MINIO = new Minio.Client({
      endPoint,
      useSSL: true,
      accessKey,
      secretKey,
    });
  }
  create(minioDto: MinioDto, file: any) {
    console.log({ minioDto });
    console.log({ file });

    const metaData: any = {
      'Content-Type': file.mimetype,
    };

    return new Promise((resolve, reject) => {
      this.MINIO.putObject(
        this.bucketName,
        `${minioDto.folderName}/${minioDto.fileName}`,
        Buffer.from(file.buffer, 'binary'),
        metaData,
        (err, objInfo) => {
          if (err) return reject(err);
          console.log('File uploaded successfully.');
          resolve(objInfo);
        },
      );
    });
  }

  findFolder(folder: string, recursive?: boolean) {
    return new Promise((resolve, reject) => {
      const stream = this.MINIO.listObjectsV2(
        this.bucketName,
        folder,
        recursive,
      );
      const objs: any = [];
      stream.on('data', (obj) => objs.push(obj));
      stream.on('end', () => resolve(objs));
      stream.on('error', (err) => reject(err));
    });
  }

  findAll(recursive = false) {
    return new Promise((resolve, reject) => {
      const stream = this.MINIO.listObjectsV2(this.bucketName, '', recursive);
      const objs: any = [];
      stream.on('data', (obj) => objs.push(obj));
      stream.on('end', () => resolve(objs));
      stream.on('error', (err) => reject(err));
    });
  }

  copy(newPath: string, oldPath: string) {
    return new Promise((resolve, reject) => {
      this.MINIO.copyObject(
        this.bucketName,
        newPath,
        `/${this.bucketName}/${oldPath}`,
        new Minio.CopyConditions(),
        (e, data) => {
          if (e) {
            return reject(e);
          }
          console.log('Successfully copied the object:');

          resolve(
            'etag = ' + data.etag + ', lastModified = ' + data.lastModified,
          );
        },
      );
    });
  }

  move(newPath: string, oldPath: string) {
    return new Promise((resolve, reject) => {
      this.MINIO.copyObject(
        this.bucketName,
        newPath,
        `/${this.bucketName}/${oldPath}`,
        new Minio.CopyConditions(),
        (e) => {
          if (e) return reject(e);

          this.MINIO.removeObject(this.bucketName, oldPath, (err) => {
            if (err) return reject(err);
            resolve(true);
          });
        },
      );
    });
  }

  remove(path: string) {
    return new Promise((resolve, reject) => {
      this.MINIO.removeObject(this.bucketName, path, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}
