import os
import time
import json
import requests
import re
from playwright.sync_api import sync_playwright

# Configuration
OUTPUT_DIR = "../public/posters"
MAP_FILE = "poster_map.json"
MOVIES_FILE = "../src/data/movies.ts"
HISTORY_URL = "https://www.amctheatres.com/my-amc/tickets?past-events-range=1y&past-events-after=cGM6MToxMDo5"

def download_image(url, filepath):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }
        response = requests.get(url, stream=True, headers=headers)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def update_movies_ts(poster_map):
    print(f"Updating {MOVIES_FILE}...")
    try:
        with open(MOVIES_FILE, 'r') as f:
            content = f.read()
            
        updated_content = content
        count = 0
        
        for title, poster_path in poster_map.items():
            safe_title = re.escape(title)
            pattern = re.compile(rf"(title:\s*['\"]{safe_title}['\"].*?)(posterUrl:\s*['\"].*?['\"])?(?=\s*\}})", re.DOTALL)
            
            match = pattern.search(updated_content)
            if match:
                full_match = match.group(0)
                if f"posterUrl: '{poster_path}'" in full_match:
                    continue
                if "posterUrl:" in full_match:
                    new_block = re.sub(r"posterUrl:\s*['\"].*?['\"]", f"posterUrl: '{poster_path}'", full_match)
                else:
                    new_block = full_match.rstrip() + f",\n    posterUrl: '{poster_path}'"
                updated_content = updated_content.replace(full_match, new_block)
                count += 1
                
        with open(MOVIES_FILE, 'w') as f:
            f.write(updated_content)
        print(f"Successfully updated {count} movie entries in {MOVIES_FILE}")
    except Exception as e:
        print(f"Error updating movies.ts: {e}")

def main():
    with sync_playwright() as p:
        print("Connecting to existing Chrome instance on port 9222...")
        try:
            # Connect to the Chrome instance (Explicitly use 127.0.0.1 to avoid IPv6 issues)
            browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
            context = browser.contexts[0]
            page = context.pages[0]
            
            print("Connected! Using current page.")
            
            print(f"Navigating to history: {HISTORY_URL}")
            page.goto(HISTORY_URL)
            page.wait_for_load_state("domcontentloaded")
            
            print("Scrolling page...")
            for _ in range(5):
                page.mouse.wheel(0, 1000)
                time.sleep(1)
            
            print("Scanning for posters...")
            images = page.query_selector_all("img")
            
            if not os.path.exists(OUTPUT_DIR):
                os.makedirs(OUTPUT_DIR)
                
            poster_map = {}
            count = 0
            
            for img in images:
                src = img.get_attribute("src")
                alt = img.get_attribute("alt")
                
                if src and "cloudinary" in src and alt:
                    filename = f"{alt.replace(' ', '_').replace(':', '').replace('/', '-').replace('*', '')}.jpg"
                    filepath = os.path.join(OUTPUT_DIR, filename)
                    poster_map[alt] = f"/posters/{filename}"
                    
                    if not os.path.exists(filepath):
                        print(f"Downloading poster for: {alt}")
                        if download_image(src, filepath):
                            count += 1
                    else:
                        print(f"Exists: {alt}")
                        
            with open(MAP_FILE, 'w') as f:
                json.dump(poster_map, f, indent=2)
                
            print(f"Finished! Downloaded {count} new posters.")
            update_movies_ts(poster_map)
            
            browser.close()
            
        except Exception as e:
            print(f"Connection error: {e}")
            print("Make sure you started Chrome with: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222")

if __name__ == "__main__":
    main()
