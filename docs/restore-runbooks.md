# Restore Runbooks

## Restoring an RDS Instance
1. Open the **AWS Backup** console and locate the required snapshot in the backup vault.
2. Start a restore job targeting a new RDS instance or cluster.
3. Update application configuration to point to the restored endpoint.
4. Validate data integrity before promoting the instance to production.

## Restoring S3 Objects
1. Identify the required object version in the source or replica bucket.
2. Use the AWS Console or CLI to restore or copy that version to the desired key.
3. If the primary region is unavailable, promote the replica bucket and update DNS or application configuration.
4. Verify application access to restored objects.
