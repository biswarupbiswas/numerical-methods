#!/usr/bin/env bash
# Copy the latest practice pages, thumbnails and MATLAB files from the lecture project into docs/.
# Practice pages are authored as Artifact bodies (no <html> skeleton), so wrap them here.
set -e
cd "$(dirname "$0")"
SRC=../numerical_methods
for page in "$SRC"/web/*.html; do
  name=$(basename "$page")
  {
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
    echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
    echo '<style>.course a{color:inherit;text-decoration:none}.course a:hover{text-decoration:underline}</style></head><body>'
    sed 's|<div class="course">Numerical Methods · Practice</div>|<div class="course"><a href="../">Numerical Methods</a> · Practice</div>|' "$page"
    echo '</body></html>'
  } > "docs/practice/$name"
done
cp "$SRC"/thumbnails/*.png docs/assets/thumbnails/
cp "$SRC"/lec*/matlab/*.m docs/downloads/ 2>/dev/null || true
echo "synced"
