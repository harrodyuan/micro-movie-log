import os
import re
import time
import requests
import json
import random

MOVIES_FILE = "../src/data/movies.ts"
OUTPUT_DIR = "../public/posters"

def get_movies():
    with open(MOVIES_FILE, 'r') as f:
        content = f.read()
    
    # Regex to extract basic movie info
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

def search_bing_images(query):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }
    
    url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2&first=1"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            # Simple regex to find image URLs in Bing's messy HTML
            # We look for .jpg or .png inside murl (metadata url) or similar structures
            # Bing often puts the direct URL in "murl":"https://..."
            
            matches = re.findall(r'"murl":"(https?://[^"]+?\.(?:jpg|png|jpeg))"', response.text)
            
            if matches:
                return matches[0] # Return first result
    except Exception as e:
        print(f"  Bing search error: {e}")
        
    return None

def download_poster(title, year):
    search_term = f"{title} {year} movie poster high resolution"
    print(f"Searching Bing for: {search_term}")
    
    filename = f"{title.replace(' ', '_').replace(':', '').replace('/', '-').replace('*', '')}.jpg"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Check if exists
    if os.path.exists(filepath):
        print(f"  Skipping, already exists: {filename}")
        return f"/posters/{filename}"

    image_url = search_bing_images(search_term)
    
    if image_url:
        print(f"  Found image: {image_url[:60]}...")
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            response = requests.get(image_url, headers=headers, timeout=10)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                return f"/posters/{filename}"
            else:
                print(f"  Failed to download image (status {response.status_code})")
        except Exception as e:
            print(f"  Download error: {e}")
    else:
        print("  No results found on Bing.")
        
    return None

def update_movies_file(movie_updates):
    with open(MOVIES_FILE, 'r') as f:
        content = f.read()
        
    for title, poster_path in movie_updates.items():
        if not poster_path:
            continue
            
        safe_title = re.escape(title)
        # Find the block for this title
        # We use }} to escape the closing brace in f-string to match a literal }
        pattern = re.compile(rf"(title:\s*['\"]{safe_title}['\"].*?)(posterUrl:\s*['\"].*?['\"])?(?=\s*\}})", re.DOTALL)
        
        match = pattern.search(content)
        if match:
            full_match = match.group(0)
            
            # If already has this poster, skip
            if f"posterUrl: '{poster_path}'" in full_match:
                continue
                
            # Replace or add
            if "posterUrl:" in full_match:
                new_block = re.sub(r"posterUrl:\s*['\"].*?['\"]", f"posterUrl: '{poster_path}'", full_match)
            else:
                # Add before closing brace
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
    
    for movie in movies:
        poster_path = download_poster(movie['title'], movie['year'])
        if poster_path:
            updates[movie['title']] = poster_path
        # Random delay to look human
        time.sleep(random.uniform(2, 5))
        
    update_movies_file(updates)

if __name__ == "__main__":
    main()
