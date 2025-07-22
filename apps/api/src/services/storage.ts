import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    },
  });

  await upload.done();

  // Return the public URL
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
};

export const deleteFile = async (fileName: string): Promise<void> => {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
    })
  );
};
