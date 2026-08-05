#!/usr/bin/env python3
"""
Script to populate category images using picsum.photos and the Retro backend API.
Downloads images for categories and stores them locally.
"""

import os
import requests
from pathlib import Path
import random

# Configuration
UPLOADS_DIR = "/Users/jasonsammon/Code/React/BootCamp/May-26/The-Rest-is-Retro/server/uploads"

# Category images
CATEGORIES = [
    ("Clothing", 100),
    ("Electronics", 200),
    ("Furniture", 300),
    ("Vinyl & Music", 400),
    ("Toys & Games", 500),
]

def download_category_image(category_name, seed_id):
    """Download an image for a category from picsum.photos"""
    try:
        filename = f"category-{category_name.lower().replace(' & ', '-').replace(' ', '-')}.jpg"
        save_path = os.path.join(UPLOADS_DIR, filename)

        print(f"  Downloading image for {category_name}...")

        # Use picsum with seed for reproducibility
        image_url = f"https://picsum.photos/600/400?random={seed_id}"

        # Download the image
        img_response = requests.get(image_url, timeout=10, allow_redirects=True)
        img_response.raise_for_status()

        # Save the image
        with open(save_path, "wb") as f:
            f.write(img_response.content)

        print(f"  ✓ Downloaded: {filename}")
        return True

    except requests.exceptions.RequestException as e:
        print(f"  ! Download failed: {e}")
        return False
    except Exception as e:
        print(f"  ! Error: {e}")
        return False

def main():
    """Main script execution"""
    print("=" * 60)
    print("Retro - Category Image Population Tool")
    print("=" * 60)

    # Create uploads directory if it doesn't exist
    Path(UPLOADS_DIR).mkdir(parents=True, exist_ok=True)

    success_count = 0
    for category_name, seed_id in CATEGORIES:
        print(f"\n[{CATEGORIES.index((category_name, seed_id)) + 1}/{len(CATEGORIES)}] {category_name}")
        if download_category_image(category_name, seed_id):
            success_count += 1

    print("\n" + "=" * 60)
    print(f"Complete! Downloaded {success_count}/{len(CATEGORIES)} category images")
    print("=" * 60)

if __name__ == "__main__":
    main()
