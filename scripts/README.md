# Retro Image Population Tool

This script automates the process of finding and uploading images for inventory items via the Retro API.

## What it does

1. **Authenticates** with the API using test user credentials
2. **Fetches all items** from the database
3. **Searches the web** for images matching each item name
4. **Downloads images** locally
5. **Creates simplified filenames** for consistency
6. **Uploads images via the API** which:
   - Stores the physical file in `server/uploads/`
   - Updates the item record with the image URL in the database

## Setup

### Prerequisites
- Python 3.7+
- Backend server running on `http://localhost:3001`
- At least one user account with email `vera@retro.test` and password `password123`

### Installation

```bash
cd scripts
pip install -r requirements.txt
```

## Usage

```bash
python populate_images.py
```

The script will:
- Process items without images first
- Download one image per item
- Upload each image via the API
- Clean up temporary files when done

## Output

```
============================================================
Retro - Image Population Tool
============================================================
✓ Logged in as vera@retro.test
✓ Retrieved 48 items

Found 48 items without images
============================================================

[1/48] Bell-Bottom Corduroy Pants
  Era: 1970s, ID: 1
  Searching for: Bell-Bottom Corduroy Pants 1970s vintage
  ✓ Downloaded: 1_bellbottom_corduroy_pants.jpg
  ✓ Image uploaded for item 1

[2/48] Sony Walkman TPS-L2
...

============================================================
Complete! Updated 48/48 items
============================================================
```

## How it works

### API Flow

1. **Login**: POST `/api/users/login` → Get JWT token
2. **Get Items**: GET `/api/items` → List all items
3. **Upload Image**: PUT `/api/items/{id}` with multipart form data
   - The backend uses multer to save the file
   - Returns the image URL which is stored in the database

### Image Search

The script attempts to find images using:
1. Primary: `bing-image-downloader` library (requires internet)
2. Fallback: Direct Bing image search with HTML parsing

### Filename Convention

Images are named using the pattern: `{item_id}_{simplified_title}.jpg`

Example: `1_bellbottom_corduroy_pants.jpg`

## Notes

- The script is rate-limited (0.5s delay between items) to be respectful to the server
- Temporary files are cleaned up after processing
- Items that already have images are skipped
- Failed downloads are logged but don't stop the script
- The API token is automatically refreshed if needed

## Troubleshooting

### "Failed to authenticate with API"
- Ensure the backend is running on port 3001
- Verify the test user exists (seed the database if needed)

### "bing-image-downloader not installed"
- The script falls back to a simpler search method
- Results may be less reliable without the library

### Images not appearing
- Check `server/uploads/` folder for downloaded files
- Verify the database was updated: check item `image_url` field
- Ensure the client is refreshed (hard refresh in browser)

## Future Enhancements

- Support for parallel image downloads
- Image optimization/resizing before upload
- Better error recovery and retry logic
- Support for custom search providers
- Dry-run mode to preview changes
