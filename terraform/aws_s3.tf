resource "aws_s3_bucket" "lazarus_s3" {
  bucket = "public-lazarus-static-content"
}

resource "aws_s3_bucket_policy" "allow_internet_access" {
  bucket = aws_s3_bucket.lazarus_s3.id
  policy = data.aws_iam_policy_document.allow_internet_access.json
}

data "aws_iam_policy_document" "allow_internet_access" {
  statement {
    effect  = "Allow"
    actions = ["s3:GetObject"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [aws_s3_bucket.lazarus_s3.arn, "${aws_s3_bucket.lazarus_s3.arn}/*"]
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket                  = aws_s3_bucket.lazarus_s3.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
