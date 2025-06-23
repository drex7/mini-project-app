import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const s3Client = new S3Client({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  })

  const key = `images/${Date.now()}-${body.filename}`
  console.dir(body);
  const command = new PutObjectCommand({
    Bucket: config.awsS3Bucket,
    Key: key,
    ContentType: 'image/*',
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  // console.log(`Generated signed URL: ${url}`)
  return { url, key }
})