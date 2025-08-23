# Backup Strategy

## RDS Snapshot Schedule
- Automated snapshots run daily at **05:00 UTC** via AWS Backup.
- Backups are retained for **30 days** in a dedicated backup vault.
- The schedule and retention are configurable through Terraform variables.

## S3 Versioning and Replication
- S3 buckets have **versioning enabled** to preserve object history.
- A cross-region replication rule copies objects to a bucket in another region for disaster recovery.
- Replicated buckets also maintain versioning to provide multi-region recovery points.
