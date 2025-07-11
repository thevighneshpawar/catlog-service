import config from 'config';
import { FileData, FileStorage } from '../types/storage';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { Readable } from 'stream';

export class Cloudinary implements FileStorage {
  private client: typeof cloudinary;

  constructor() {
    this.client = cloudinary;

    // Validate required configuration
    const cloudName = config.get<string>('cloudinary.cloudName');
    const apiKey = config.get<string>('cloudinary.apiKey');
    const apiSecret = config.get<string>('cloudinary.apiSecret');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Missing required Cloudinary configuration: cloudName, apiKey, or apiSecret',
      );
    }

    const cloudinaryConfig: ConfigOptions = {
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    };

    this.client.config(cloudinaryConfig);
  }

  async upload(data: FileData): Promise<void> {
    // Convert ArrayBuffer to Stream for Cloudinary upload
    const buffer = Buffer.from(data.fileData);
    const stream = Readable.from(buffer);

    // Wrap the upload_stream in a Promise to handle async properly

    const uploadStream = this.client.uploader.upload_stream({
      resource_type: 'auto', // automatically detect the file type
      public_id: data.filename,
      overwrite: false, // prevent accidental overwrites
    });

    stream.pipe(uploadStream);
  }

  //   delete(filename: string): Promise<void> {
  //     throw new Error('Method not implemented.');
  //   }

  //   getObjectUri(filename: string): string {
  //     throw new Error('Method not implemented.');
  //   }
}
