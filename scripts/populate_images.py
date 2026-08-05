#!/usr/bin/env python3
"""
Script to populate item images using free image service and the Retro backend API.
Downloads real images for items and updates them via the API.
"""

import os
import sys
import requests
import json
from pathlib import Path
from urllib.parse import urlparse
import time
import random

# Configuration
API_BASE_URL = "http://localhost:3001"
TEST_USER_EMAIL = "vera@retro.test"
TEST_USER_PASSWORD = "password123"

# Free image service URLs (picsum.photos provides random images without auth)
PICSUM_URL = "https://picsum.photos"

class RetroAPIClient:
    def __init__(self, base_url=API_BASE_URL):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()

    def login(self, email, password):
        """Login and get JWT token"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/users/login",
                json={"email": email, "password": password}
            )
            response.raise_for_status()
            data = response.json()
            self.token = data.get("token")
            print(f"✓ Logged in as {email}")
            return self.token
        except Exception as e:
            print(f"✗ Login failed: {e}")
            return None

    def get_items(self):
        """Get all items from the API"""
        try:
            response = self.session.get(f"{self.base_url}/api/items")
            response.raise_for_status()
            items = response.json()
            print(f"✓ Retrieved {len(items)} items")
            return items
        except Exception as e:
            print(f"✗ Failed to get items: {e}")
            return []

    def upload_image(self, item_id, image_path):
        """Upload an image and update item"""
        try:
            headers = {"Authorization": f"Bearer {self.token}"}

            with open(image_path, "rb") as f:
                files = {"image": (os.path.basename(image_path), f, "image/jpeg")}
                data = {}

                response = self.session.put(
                    f"{self.base_url}/api/items/{item_id}",
                    files=files,
                    data=data,
                    headers=headers
                )
                response.raise_for_status()
                updated_item = response.json()
                print(f"  ✓ Image uploaded for item {item_id}")
                return updated_item
        except Exception as e:
            print(f"  ✗ Upload failed: {e}")
            return None

def download_image(search_query, save_path, max_retries=3):
    """Download a random image from picsum.photos (no auth required)"""
    try:
        print(f"  Downloading random image for: {search_query}")

        # Use random image from picsum.photos (600x600 size, random id)
        random_id = random.randint(1, 1000)
        image_url = f"{PICSUM_URL}/600/600?random={random_id}"

        # Download the image
        img_response = requests.get(image_url, timeout=10, allow_redirects=True)
        img_response.raise_for_status()

        # Save the image
        with open(save_path, "wb") as f:
            f.write(img_response.content)

        print(f"  ✓ Downloaded: {os.path.basename(save_path)}")
        return True

    except requests.exceptions.RequestException as e:
        print(f"  ! Download failed: {e}, using fallback...")
        return create_minimal_jpeg(save_path)
    except Exception as e:
        print(f"  ! Error: {e}, using fallback...")
        return create_minimal_jpeg(save_path)

def create_minimal_jpeg(save_path):
    """Create a minimal valid JPEG file"""
    try:
        # Minimal JPEG file (1x1 pixel)
        minimal_jpeg = bytes([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
            0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
            0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
            0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x0A, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
            0x7F, 0xFF, 0xD9
        ])
        with open(save_path, "wb") as f:
            f.write(minimal_jpeg)
        print(f"  ✓ Created: {os.path.basename(save_path)}")
        return True
    except Exception as e:
        print(f"  ! Minimal JPEG failed: {e}")
        return False


def simplify_filename(item_title, item_id, extension=".jpg"):
    """Create a simplified filename from item title"""
    # Remove special characters and spaces
    simplified = item_title.lower()
    simplified = "".join(c if c.isalnum() or c == " " else "" for c in simplified)
    simplified = simplified.replace(" ", "_")[:30]  # Limit to 30 chars
    return f"{item_id}_{simplified}{extension}"

def main():
    """Main script execution"""
    print("=" * 60)
    print("Retro - Image Population Tool")
    print("=" * 60)

    # Create uploads directory if it doesn't exist
    uploads_dir = Path("temp_images")
    uploads_dir.mkdir(exist_ok=True)

    # Initialize API client
    client = RetroAPIClient()

    # Login
    if not client.login(TEST_USER_EMAIL, TEST_USER_PASSWORD):
        print("Failed to authenticate with API")
        sys.exit(1)

    # Get items
    items = client.get_items()
    if not items:
        print("No items found")
        sys.exit(1)

    # Filter items without images
    items_without_images = [item for item in items if not item.get("image_url")]
    print(f"\nFound {len(items_without_images)} items without images")
    print("=" * 60)

    # Process items
    success_count = 0
    for idx, item in enumerate(items_without_images, 1):
        item_id = item.get("id")
        title = item.get("title", "vintage item")
        era = item.get("era", "")

        print(f"\n[{idx}/{len(items_without_images)}] {title}")
        print(f"  Era: {era}, ID: {item_id}")

        # Create search query
        search_query = f"{title} {era} vintage"

        # Simplified filename
        filename = simplify_filename(title, item_id)
        image_path = uploads_dir / filename

        # Download image
        if download_image(search_query, str(image_path)):
            # Upload to API
            client.upload_image(item_id, str(image_path))
            success_count += 1
            time.sleep(0.5)  # Be nice to the server
        else:
            print(f"  ! Skipped (no image found)")

    # Cleanup
    import shutil
    if (Path("dataset").exists()):
        shutil.rmtree("dataset")
    shutil.rmtree(uploads_dir)

    print("\n" + "=" * 60)
    print(f"Complete! Updated {success_count}/{len(items_without_images)} items")
    print("=" * 60)

if __name__ == "__main__":
    main()
