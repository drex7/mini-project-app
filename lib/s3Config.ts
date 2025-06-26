import { S3Client } from "@aws-sdk/client-s3";

function getS3Client(config) {

	let s3Client: S3Client;

	if (!config) {
		throw new Error("Configuration is required to create S3 client");
	}
	if (process.env.NODE_ENV !== "production") {
		console.log("Creating S3 client in non-production environment");
		
		s3Client = new S3Client({
			region: config.awsRegion,
			credentials: {
				accessKeyId: config.awsAccessKeyId,
				secretAccessKey: config.awsSecretAccessKey,
			},
		});	
	} else {
		console.log("Creating S3 client in production environment");
		s3Client = new S3Client({
			region: config.awsRegion
		});
	}

	return s3Client;
}

export { getS3Client };
