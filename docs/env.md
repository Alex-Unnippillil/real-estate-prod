# Environment Variables

The application relies on the following environment variables. All are validated at startup using a shared Zod schema to ensure the application fails fast when misconfigured.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for client API requests. |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox access token used for map components. |
| `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID` | AWS Cognito user pool identifier for authentication. |
| `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID` | AWS Cognito user pool client ID for authentication. |
| `AWS_REGION` | AWS region used by the server when interacting with AWS services. |
| `S3_BUCKET_NAME` | Name of the S3 bucket storing property images. |
| `PORT` | Port for the Express server (defaults to `3002`). |
