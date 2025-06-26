import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getS3Client } from '~/lib/s3Config'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const body = await readBody(event)

  const s3Client = getS3Client(config)

  const key = `images/${Date.now()}-${body.filename}`
  console.dir(body);
  const command = new PutObjectCommand({
    Bucket: config.awsS3Bucket,
    Key: key,
    ContentType: 'image/*',
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  
  return { url, key }
})