import os
import sys
import boto3
from botocore.config import Config

account_id = "8828224d7cf0b23ecaac1d8e0bda4986"
access_key_id = "77ae5d88a97534c0e8f3659b52239052"
secret_access_key = "27633b8a3d21f151f416106d8bb0c88d7dc8b874e9e9273f2a0e685f12836bea"
endpoint = "https://8828224d7cf0b23ecaac1d8e0bda4986.r2.cloudflarestorage.com"
bucket = "jml-videos"

s3 = boto3.client(
    "s3",
    endpoint_url=endpoint,
    aws_access_key_id=access_key_id,
    aws_secret_access_key=secret_access_key,
    config=Config(signature_version="s3v4")
)

files = [
    ("temp_videos/portada-horizontal.mp4", "y-el-ano-que-viene-que/portada-horizontal.mp4"),
    ("temp_videos/portada-vertical.mp4", "y-el-ano-que-viene-que/portada-vertical.mp4"),
]

for local_path, r2_key in files:
    print(f"Subiendo {local_path} -> {r2_key} ...")
    size = os.path.getsize(local_path)
    print(f"Tamaño: {size / (1024*1024):.2f} MB")
    
    with open(local_path, "rb") as f:
        s3.upload_fileobj(
            f,
            bucket,
            r2_key,
            ExtraArgs={"ContentType": "video/mp4"}
        )
    print(f"OK: https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/{r2_key}")

print("Todos los vídeos subidos correctamente a Cloudflare R2.")
