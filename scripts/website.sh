#!/usr/bin/env bash

mkdir -p logs

# This downloads a set of key-value env variables, but blocks any requests that aren't from GitHub Actions
curl -g https://us-central1-clarity-design-system.cloudfunctions.net/actions -o .env
# dotenv loads up the env variables into the shell, then deploys through Netlify

# Deploy a preview that can be promoted to production when we are ready
node -r dotenv/config -- ./node_modules/.bin/netlify deploy --json --dir=./dist/website --message="Website - $GITHUB_REF@$GITHUB_SHA" --site "clarity.design" > ./logs/clarity.design.netlify.json
# Deploy a version to https://next.clarity.design as 'production'
node -r dotenv/config -- ./node_modules/.bin/netlify deploy --json --dir=./dist/website --message="Website - $GITHUB_REF@$GITHUB_SHA" --site "next.clarity.design" > ./logs/next.clarity.design.netlify.json

echo "Clarity Design Netlify"
cat ./logs/clarity.design.netlify.json

echo "Clarity Next Design Netlify"
cat ./logs/next.clarity.design.netlify.json