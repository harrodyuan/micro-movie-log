import os
import re
import time
import requests
from playwright.sync_api import sync_playwright

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Define paths relative to the script
MOVIES_FILE = os.path.join(SCRIPT_DIR, "../src/data/movies.ts")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "../public/posters")

def get_movies():
    with open(MOVIES_FILE, 'r') as f:
        content = f.read()
    
    movies = []
    blocks = re.findall(r"\{[\s\S]*?\}", content)
    
    for block in blocks:
        title_match = re.search(r"title:\s*['\"](.*?)['\"]", block)
        date_match = re.search(r"date:\s*['\"](\d{4})-\d{2}-\d{2}['\"]", block)
        
        if title_match and date_match:
            movies.append({
                'title': title_match.group(1),
                'year': date_match.group(1),
                'block': block
            })
    return movies

def update_movies_file(movie_updates):
    with open(MOVIES_FILE, 'r') as f:
        content = f.read()
        
    for title, poster_path in movie_updates.items():
        if not poster_path:
            continue
            
        safe_title = re.escape(title)
        pattern = re.compile(rf"(title:\s*['\"]{safe_title}['\"].*?)(posterUrl:\s*['\"].*?['\"])?(?=\s*\}})", re.DOTALL)
        
        match = pattern.search(content)
        if match:
            full_match = match.group(0)
            if f"posterUrl: '{poster_path}'" in full_match:
                continue
            if "posterUrl:" in full_match:
                new_block = re.sub(r"posterUrl:\s*['\"].*?['\"]", f"posterUrl: '{poster_path}'", full_match)
            else:
                new_block = full_match.rstrip() + f",\n    posterUrl: '{poster_path}'"
            content = content.replace(full_match, new_block)
            
    with open(MOVIES_FILE, 'w') as f:
        f.write(content)
    print("Updated movies.ts")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    movies = get_movies()
    print(f"Found {len(movies)} movies.")
    
    updates = {}
    
    with sync_playwright() as p:
        # Launch browser headless for automation
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for i, movie in enumerate(movies):
            title = movie['title']
            year = movie['year']
            
            # Skip if already downloaded (check file existence)
            filename = f"{title.replace(' ', '_').replace(':', '').replace('/', '-').replace('*', '')}.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            if os.path.exists(filepath):
                print(f"[{i+1}/{len(movies)}] Skipping {title}, already exists.")
                updates[title] = f"/posters/{filename}"
                continue
                
            print(f"[{i+1}/{len(movies)}] Searching for: {title} ({year})")
            
            try:
                # Search Bing Images directly
                search_query = f"{title} {year} movie poster high resolution"
                url = f"https://www.bing.com/images/search?q={search_query}&first=1"
                
                page.goto(url, timeout=30000)
                # Wait for images to load
                page.wait_for_selector(".mimg", timeout=5000)
                
                # Get the source of the first image result
                # Bing image results usually have class 'mimg'
                img_src = page.get_attribute(".mimg", "src")
                if not img_src:
                     img_src = page.get_attribute(".mimg", "data-src")
                
                if img_src:
                    # Download it
                    if img_src.startswith("data:"):
                        # Handle base64
                        import base64
                        header, encoded = img_src.split(",", 1)
                        data = base64.b64decode(encoded)
                        with open(filepath, "wb") as f:
                            f.write(data)
                    else:
                        # Handle URL
                        response = requests.get(img_src, timeout=10)
                        if response.status_code == 200:
                            with open(filepath, "wb") as f:
                                f.write(response.content)
                                
                    print(f"  Saved to {filename}")
                    updates[title] = f"/posters/{filename}"
                else:
                    print("  No image found on page.")
                    
            except Exception as e:
                print(f"  Error: {e}")
            
            # Small delay
            time.sleep(1)
            
        browser.close()
        
    update_movies_file(updates)

if __name__ == "__main__":
    main()
