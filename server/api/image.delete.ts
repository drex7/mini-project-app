import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "~/lib/s3Config";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  
	const query = getQuery(event);
	const key = query?.key as string;
	
	if (!key) {
		return { error: "Missing key" };
	}

  const s3Client = getS3Client(config);

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
  return { success: true };
});
