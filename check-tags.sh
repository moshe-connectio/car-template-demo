#!/bin/bash
# Get database URL
source ~/.env.local 2>/dev/null || source .env.local 2>/dev/null || echo "No env file"

echo "Checking products with tags..."
# Use curl to query the products page which should show tags
curl -s "http://localhost:3000/products" | grep -i "tag" | head -5 || echo "No tags found in HTML"
