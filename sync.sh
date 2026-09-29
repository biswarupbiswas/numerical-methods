#!/usr/bin/env bash
# Copy the latest lecture thumbnails from the video project into the site.
set -e
cd "$(dirname "$0")"
cp ../numerical_methods/thumbnails/*.png docs/assets/thumbnails/
echo "synced thumbnails"
