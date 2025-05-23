import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    /**
     * Inject uploadsRepository
     */
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
    /**
     * Inject UploadToAwsProvider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    /**
     * Inject ConfigService
     */
    private readonly configService: ConfigService,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    // throw error for unsupported MIME types
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported');
    }

    try {
      // Upload the file to AWS S3
      const path = await this.uploadToAwsProvider.fileUpload(file);
      // Generate a new entry in the database
      const uploadFile: UploadFile = {
        name: path,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${path}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
