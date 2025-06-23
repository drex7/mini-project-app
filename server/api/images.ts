import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 12


  const s3Client = new S3Client({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  })

  const command = new ListObjectsV2Command({
    Bucket: config.awsS3Bucket,
    Prefix: 'images/',
    MaxKeys: pageSize,
    ContinuationToken: page > 1 ? query.continuationToken as string : undefined,
  })

  const response = await s3Client.send(command)
  const contents = response.Contents?.slice(1) || [];
  const images =
    contents.map((item) => ({
      key: item.Key,
      url: `https://${config.awsS3Bucket}.s3.${config.awsRegion}.amazonaws.com/${item.Key}`,
    })) || [];

  return {
    images,
    nextContinuationToken: response.NextContinuationToken,
    totalPages: response.IsTruncated ? page + 1 : page,
    currentPage: page,
  }
})