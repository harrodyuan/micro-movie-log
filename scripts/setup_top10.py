import os
import shutil
import time
import requests
from playwright.sync_api import sync_playwright

# Configuration
SOURCE_DIR = "../public/posters"
DEST_DIR = "../public/top10"

# Mapping of Rank -> { Title, Expected Filename in Source, Search Query if missing }
TOP_10 = [
    {
        "rank": 1,
        "title": "Zootopia 2",
        "source_name": "Zootopia_2.jpg",
        "dest_name": "1_Zootopia2.jpg",
        "query": "Zootopia 2 2025 movie poster"
    },
    {
        "rank": 2,
        "title": "Hamnet",
        "source_name": "Hamnet.jpg",
        "dest_name": "2_Hamnet.jpg",
        "query": "Hamnet movie poster Chloe Zhao"
    },
    {
        "rank": 3,
        "title": "One Battle After Another",
        "source_name": "One_Battle_After_Another.jpg",
        "dest_name": "3_OneBattleAfterAnother.jpg",
        "query": "One Battle After Another Paul Thomas Anderson poster"
    },
    {
        "rank": 4,
        "title": "Back to the Future",
        "source_name": "Back_to_the_Future_–_40th_Anniversary.jpg",
        "dest_name": "4_BackToTheFuture.jpg",
        "query": "Back to the Future 40th Anniversary poster"
    },
    {
        "rank": 5,
        "title": "Roofman",
        "source_name": "Roofman.jpg",
        "dest_name": "5_Roofman.jpg",
        "query": "Roofman Channing Tatum movie poster"
    },
    {
        "rank": 6,
        "title": "Apollo 13",
        "source_name": "Apollo_13_30th_Anniversary.jpg",
        "dest_name": "6_Apollo13.jpg",
        "query": "Apollo 13 30th Anniversary IMAX poster"
    },
    {
        "rank": 7,
        "title": "Brokeback Mountain",
        "source_name": "Brokeback_Mountain_20th_Anniversary.jpg",
        "dest_name": "7_BrokebackMountain.jpg",
        "query": "Brokeback Mountain 20th Anniversary poster"
    },
    {
        "rank": 8,
        "title": "Sinners",
        "source_name": "Sinners.jpg", 
        "dest_name": "8_Sinners.jpg",
        "query": "Sinners Ryan Coogler movie poster 2025"
    },
    {
        "rank": 9,
        "title": "I'm Still Here",
        "source_name": "Im_Still_Here.jpg",
        "dest_name": "9_ImStillHere.jpg",
        "query": "I'm Still Here Walter Salles movie poster"
    },
    {
        "rank": 10,
        "title": "Weapons",
        "source_name": "Weapons.jpg",
        "dest_name": "10_Weapons.jpg",
        "query": "Weapons movie poster Zach Cregger"
    }
]

def download_image(url, filepath):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def main():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    # 1. Try to copy from existing posters
    missing_items = []
    
    print("Checking existing posters...")
    for item in TOP_10:
        source_path = os.path.join(SOURCE_DIR, item["source_name"])
        dest_path = os.path.join(DEST_DIR, item["dest_name"])
        
        if os.path.exists(source_path):
            print(f"✅ Found {item['title']}, copying...")
            shutil.copy2(source_path, dest_path)
        else:
            print(f"❌ Missing {item['title']} (looked for {item['source_name']})")
            missing_items.append(item)

    if not missing_items:
        print("All posters set up!")
        return

    # 2. Download missing ones
    print(f"\nDownloading {len(missing_items)} missing posters...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for item in missing_items:
            print(f"Searching for: {item['title']}...")
            try:
                # Bing search
                url = f"https://www.bing.com/images/search?q={item['query']}&first=1"
                page.goto(url, timeout=30000)
                page.wait_for_selector(".mimg", timeout=5000)
                
                img_src = page.get_attribute(".mimg", "src")
                if not img_src:
                     img_src = page.get_attribute(".mimg", "data-src")
                
                if img_src:
                    dest_path = os.path.join(DEST_DIR, item["dest_name"])
                    
                    if img_src.startswith("data:"):
                        import base64
                        header, encoded = img_src.split(",", 1)
                        data = base64.b64decode(encoded)
                        with open(dest_path, "wb") as f:
                            f.write(data)
                    else:
                        download_image(img_src, dest_path)
                        
                    print(f"✅ Downloaded {item['title']}")
                else:
                    print(f"⚠️ Could not find image for {item['title']}")
                    
            except Exception as e:
                print(f"Error processing {item['title']}: {e}")
            
            time.sleep(2)
            
        browser.close()

if __name__ == "__main__":
    main()
