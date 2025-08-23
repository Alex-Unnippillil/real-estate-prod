# Infrastructure

Terraform configuration for core AWS resources powering the Real Estate application.

## Terraform State

Terraform state is stored in an S3 bucket with DynamoDB table for locking. Ensure the bucket `real-estate-terraform-state` and DynamoDB table `real-estate-terraform-locks` exist and have versioning enabled before running the configuration.

## Deployment

1. Install [Terraform](https://www.terraform.io/) version 1.3 or newer.
2. Configure AWS credentials with permission to create the resources.
3. Initialize the project:
   ```sh
   terraform init
   ```
4. Review the execution plan:
   ```sh
   terraform plan
   ```
5. Apply the changes:
   ```sh
   terraform apply
   ```

The modules provision a VPC, ECS cluster, S3 bucket, and RDS instance. Key identifiers and secrets are written to AWS Systems Manager Parameter Store under the `/real-estate/` path for consumption by other services.
