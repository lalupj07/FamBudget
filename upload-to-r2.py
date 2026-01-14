#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload FamBudget installer files to Cloudflare R2
Uses S3-compatible API with boto3
"""

import boto3
import os
import sys
from botocore.config import Config

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# R2 Configuration
ACCOUNT_ID = "647f9fc61c9ebc9d3727647373806a51"
BUCKET_NAME = "fambudget-releases"
ENDPOINT_URL = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"

# Files to upload
FILES_TO_UPLOAD = [
    {
        "local": "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.exe",
        "key": "FamBudget-3.5.1-x64.exe",
        "content_type": "application/octet-stream"
    },
    {
        "local": "desktop-app/dist-v3.5.1/FamBudget-3.5.1-x64.msi",
        "key": "FamBudget-3.5.1-x64.msi",
        "content_type": "application/octet-stream"
    }
]


def get_file_size_mb(file_path):
    """Get file size in MB"""
    size_bytes = os.path.getsize(file_path)
    size_mb = size_bytes / (1024 * 1024)
    return size_mb


def upload_file(s3_client, bucket, local_path, key, content_type):
    """Upload a file to R2"""
    if not os.path.exists(local_path):
        print(f"❌ File not found: {local_path}")
        return False
    
    file_size_mb = get_file_size_mb(local_path)
    print(f"\n📤 Uploading: {key}")
    print(f"   Size: {file_size_mb:.2f} MB")
    print(f"   From: {local_path}")
    
    try:
        # boto3 handles multipart uploads automatically for files > 8MB
        # For very large files, we configure transfer settings
        if file_size_mb > 100:
            print("   Using multipart upload (automatic for large files)...")
            from boto3.s3.transfer import TransferConfig
            transfer_config = TransferConfig(
                multipart_threshold=1024 * 25,  # 25 MB - threshold for multipart
                multipart_chunksize=1024 * 1024 * 100,  # 100 MB chunks
                max_concurrency=10  # Concurrent uploads
            )
            s3_client.upload_file(
                local_path,
                bucket,
                key,
                ExtraArgs={'ContentType': content_type},
                Config=transfer_config
            )
        else:
            s3_client.upload_file(
                local_path,
                bucket,
                key,
                ExtraArgs={'ContentType': content_type}
            )
        
        print(f"✅ Uploaded: {key}")
        return True
    except Exception as e:
        print(f"❌ Error uploading {key}: {str(e)}")
        return False


def main():
    """Main upload function"""
    print("=" * 60)
    print("Cloudflare R2 Upload Script")
    print("=" * 60)
    print(f"Bucket: {BUCKET_NAME}")
    print(f"Endpoint: {ENDPOINT_URL}")
    print("=" * 60)
    
    # Get credentials from environment or prompt
    access_key = os.environ.get('R2_ACCESS_KEY_ID')
    secret_key = os.environ.get('R2_SECRET_ACCESS_KEY')
    
    if not access_key or not secret_key:
        print("\n⚠️  R2 credentials not found in environment variables.")
        print("\nPlease provide your R2 API credentials:")
        print("You can get them from: https://dash.cloudflare.com/")
        print("Navigate to: Manage Account → R2 → Manage R2 API Tokens")
        print("\nOr set environment variables:")
        print("  $env:R2_ACCESS_KEY_ID='your-access-key'")
        print("  $env:R2_SECRET_ACCESS_KEY='your-secret-key'")
        
        # Try to get from user input
        try:
            access_key = input("\nEnter R2 Access Key ID: ").strip()
            secret_key = input("Enter R2 Secret Access Key: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n❌ Cancelled")
            sys.exit(1)
        
        if not access_key or not secret_key:
            print("❌ Credentials required")
            sys.exit(1)
    
    # Create S3 client for R2
    try:
        print("\n🔗 Connecting to R2...")
        s3_client = boto3.client(
            's3',
            endpoint_url=ENDPOINT_URL,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='auto',
            config=Config(signature_version='s3v4')
        )
        
        # Test connection by listing bucket
        s3_client.head_bucket(Bucket=BUCKET_NAME)
        print("✅ Connected to R2")
        
    except Exception as e:
        print(f"❌ Failed to connect to R2: {str(e)}")
        print("\nPlease check:")
        print("  1. Your R2 API credentials are correct")
        print("  2. The bucket name is correct")
        print("  3. Your account has access to this bucket")
        sys.exit(1)
    
    # Upload files
    print("\n" + "=" * 60)
    print("Starting Upload...")
    print("=" * 60)
    
    success_count = 0
    for file_info in FILES_TO_UPLOAD:
        if upload_file(
            s3_client,
            BUCKET_NAME,
            file_info["local"],
            file_info["key"],
            file_info["content_type"]
        ):
            success_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("Upload Summary")
    print("=" * 60)
    print(f"✅ Successfully uploaded: {success_count}/{len(FILES_TO_UPLOAD)} files")
    
    if success_count == len(FILES_TO_UPLOAD):
        print("\n🎉 All files uploaded successfully!")
        print(f"\nFiles are available in bucket: {BUCKET_NAME}")
        print("\nTo enable public access:")
        print("  1. Go to: https://dash.cloudflare.com/")
        print("  2. Navigate to: R2 → fambudget-releases → Settings")
        print("  3. Enable Public Access")
        print("  4. Copy the public URLs")
    else:
        print(f"\n⚠️  {len(FILES_TO_UPLOAD) - success_count} file(s) failed to upload")
        sys.exit(1)


if __name__ == "__main__":
    main()

