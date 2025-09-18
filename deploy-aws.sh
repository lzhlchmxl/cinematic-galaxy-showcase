#!/bin/bash

echo "🚀 Deploying Cinematic Galaxy Showcase to AWS..."

# Configuration
BUCKET_NAME="galaxy-showcase-billliang"
CLOUDFRONT_DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"
REGION="us-east-1"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if jq is installed for JSON processing
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ jq is not installed. Installing via brew...${NC}"
    brew install jq || {
        echo -e "${RED}❌ Failed to install jq. Please install manually.${NC}"
        exit 1
    }
fi

echo -e "${BLUE}📦 Building production version...${NC}"

# Clean and build
rm -rf dist
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Check if bucket exists, create if not
echo -e "${BLUE}🪣 Checking S3 bucket...${NC}"

if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo -e "${GREEN}✅ Bucket $BUCKET_NAME exists${NC}"
else
    echo -e "${BLUE}🪣 Creating S3 bucket: $BUCKET_NAME${NC}"
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION

    # Configure bucket for static website hosting
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document index.html

    # Set bucket policy for public read access
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

    aws s3api put-bucket-policy \
        --bucket $BUCKET_NAME \
        --policy file://bucket-policy.json

    rm bucket-policy.json
    echo -e "${GREEN}✅ S3 bucket configured for static hosting${NC}"
fi

# Upload files with optimized cache headers
echo -e "${BLUE}📤 Uploading files to S3...${NC}"

# Upload HTML files (no cache)
aws s3 sync dist/ "s3://$BUCKET_NAME" \
    --delete \
    --exclude "*.js" \
    --exclude "*.css" \
    --exclude "*.svg" \
    --exclude "*.jpg" \
    --exclude "*.png" \
    --cache-control "no-cache, no-store, must-revalidate"

# Upload JS/CSS files (long cache with immutable)
aws s3 sync dist/ "s3://$BUCKET_NAME" \
    --delete \
    --exclude "*" \
    --include "*.js" \
    --include "*.css" \
    --cache-control "public, max-age=31536000, immutable"

# Upload images (long cache)
aws s3 sync dist/ "s3://$BUCKET_NAME" \
    --delete \
    --exclude "*" \
    --include "*.svg" \
    --include "*.jpg" \
    --include "*.png" \
    --include "*.ico" \
    --cache-control "public, max-age=31536000"

echo -e "${GREEN}✅ Files uploaded successfully!${NC}"

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo -e "${GREEN}🌐 Website URL: $WEBSITE_URL${NC}"

# If CloudFront distribution ID is provided, invalidate cache
if [ "$CLOUDFRONT_DISTRIBUTION_ID" != "YOUR_DISTRIBUTION_ID" ]; then
    echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*"
    echo -e "${GREEN}✅ CloudFront cache invalidated${NC}"
fi

# Display bundle size
echo -e "${BLUE}📊 Bundle Analysis:${NC}"
echo "Total dist size: $(du -sh dist | cut -f1)"
echo "JavaScript files:"
find dist -name "*.js" -exec ls -lh {} \; | awk '{print $9 ": " $5}'
echo "CSS files:"
find dist -name "*.css" -exec ls -lh {} \; | awk '{print $9 ": " $5}'

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌌 Your Cinematic Galaxy Showcase is live at: $WEBSITE_URL${NC}"
echo ""
echo "Next steps:"
echo "1. Set up a custom domain with Route 53"
echo "2. Configure CloudFront for global CDN"
echo "3. Add SSL certificate with ACM"
echo "4. Share on LinkedIn for maximum impact! 🚀"