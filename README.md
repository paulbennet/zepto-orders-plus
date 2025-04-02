# Zepto (Unofficial) Orders Plus Chrome Extension

Zepto Orders Plus is a Google Chrome extension designed to enhance your experience on the Zepto platform. This extension provides a streamlined interface for viewing and managing order summaries, making it easier to analyze and sort data.

## Why this extension is created

- I needed a monthly summary of my orders on Zepto. So that I can plan what to pre-order or stock-up for the next month. This is not currently available in the Zepto app. Once this feature provided natively in Zepto, we can get rid of this extension happily.
- Also this is a POC of the above mentioned feature. So that its easy to understand how to implement this feature in the Zepto app.

## How this extension works

- The extension fetches order data using the web apis used in the Zepto Web app.
- Uses content scripts execute fetch requests to the Zepto API endpoints.
- Doesn't modify any of the existing Zepto app functionality.

## Features

- **Order Summary Management**: Fetch and display order summaries for the current or previous month.
- **Sorting Capabilities**: Sort order data by various attributes such as count or other relevant fields.
- **User-Friendly Interface**: Leverages Material-UI components for a clean and responsive design.
- **Quick Access**: Easily accessible via the browser's toolbar popup.

## Technical Details

- **Technologies Used**: React, TypeScript, Material-UI.
- **Permissions**: Accesses `https://www.zeptonow.com/*` pages to fetch order data.
- **Components**: Includes a popup interface and background scripts for seamless operation.

Enjoy a better way to manage your Zepto orders with Zepto Orders Plus!

## Development

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top-right corner.
3. Click "Load unpacked" and select this project's folder.
4. Open the extension from the browser toolbar and start managing your Zepto orders efficiently.
