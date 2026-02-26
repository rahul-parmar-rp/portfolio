#!/bin/bash

set -e

REPOS=(
  "rahul-parmar-rp"
  "twitter-poster"
  "search-countries-react"
  "react-konva-demo"
)

GITHUB_USER="rahul-parmar-rp"

echo "Setting up portfolio workspace..."

for repo in "${REPOS[@]}"; do
  if [ -d "$repo" ]; then
    echo "$repo already exists. Skipping..."
  else
    git clone git@github.com:$GITHUB_USER/$repo.git
  fi
done

echo "All repositories cloned successfully."