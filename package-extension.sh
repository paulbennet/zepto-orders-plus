#!/bin/bash

# Define the output directory for the zip file
DIST_DIR="dist"

# Ensure the dist directory exists
mkdir -p "$DIST_DIR"

# Define the name of the zip file
ZIP_FILE="$DIST_DIR/zepto-orders-plus.zip"

# List of files and directories to include in the zip
INCLUDE_FILES=(
  "dist/popup.js"
  "manifest.json"
  "background.js"
  "content.js"
  "popup.html"
  "icon.png"
  "icon-16.png"
  "icon-48.png"
  "icon-128.png"
)

# Remove the existing zip file if it exists
if [ -f "$ZIP_FILE" ]; then
  echo "Removing existing $ZIP_FILE..."
  rm "$ZIP_FILE"
fi

# Create the zip file with the specified files
echo "Creating $ZIP_FILE with required files..."
zip -r "$ZIP_FILE" "${INCLUDE_FILES[@]}"

# Confirm completion
echo "$ZIP_FILE has been created successfully."
