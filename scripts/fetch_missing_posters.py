import os
import time
import requests
from playwright.sync_api import sync_playwright

OUTPUT_DIR = "../public/posters"

# Explicit list of movies to fetch
movies_to_fetch = [
    {"title": "Sinners", "year": "2025", "query": "Sinners Ryan Coogler movie poster", "filename": "Sinners.jpg"},
    {"title": "I'm Still Here", "year": "2024", "query": "Ainda Estou Aqui movie poster", "filename": "Im_Still_Here.jpg"},
    {"title": "Brokeback Mountain: 20th Anniversary", "year": "2025", "query": "Brokeback Mountain 2025 re-release poster", "filename": "Brokeback_Mountain_20th_Anniversary.jpg"},
    {"title": "Weapons", "year": "2025", "query": "Weapons Zach Cregger movie poster", "filename": "Weapons.jpg"}
]

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for movie in movies_to_fetch:
            print(f"Searching for: {movie['title']}")
            filepath = os.path.join(OUTPUT_DIR, movie['filename'])
            
            try:
                # Search Bing Images
                url = f"https://www.bing.com/images/search?q={movie['query']}&first=1"
                page.goto(url, timeout=30000)
                page.wait_for_selector(".mimg", timeout=5000)
                
                img_src = page.get_attribute(".mimg", "src") or page.get_attribute(".mimg", "data-src")
                
                if img_src:
                    if img_src.startswith("data:"):
                        import base64
                        header, encoded = img_src.split(",", 1)
                        data = base64.b64decode(encoded)
                        with open(filepath, "wb") as f:
                            f.write(data)
                    else:
                        response = requests.get(img_src, timeout=10)
                        if response.status_code == 200:
                            with open(filepath, "wb") as f:
                                f.write(response.content)
                    print(f"  Saved to {movie['filename']}")
                else:
                    print("  No image found.")
                    
            except Exception as e:
                print(f"  Error: {e}")
            
            time.sleep(2)
            
        browser.close()

if __name__ == "__main__":
    main()
