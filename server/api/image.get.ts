import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getS3Client } from '~/lib/s3Config'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 12


  const s3Client = getS3Client(config);

  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET,
    Prefix: 'images/',
    MaxKeys: pageSize,
    ContinuationToken: page > 1 ? query.continuationToken as string : undefined,
  })

  const response = await s3Client.send(command)
  const contents = response.Contents?.slice(1) || [];
  const images =
    contents.map((item) => ({
      key: item.Key,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    })) || [];

  return {
    images,
    nextContinuationToken: response.NextContinuationToken,
    totalPages: response.IsTruncated ? page + 1 : page,
    currentPage: page,
  }
})