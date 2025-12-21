import os
import requests
from playwright.sync_api import sync_playwright

DEST_DIR = "../public/top10"
DEST_PATH = os.path.join(DEST_DIR, "1_Zootopia2.jpg")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    print("Searching for Zootopia 2 poster...")
    page.goto("https://www.bing.com/images/search?q=Zootopia+2+movie+poster+Disney+2025&first=1")
    page.wait_for_selector(".mimg", timeout=5000)
    img_src = page.get_attribute(".mimg", "src")
    if img_src:
        if img_src.startswith("data:"):
            import base64
            header, encoded = img_src.split(",", 1)
            data = base64.b64decode(encoded)
            with open(DEST_PATH, "wb") as f:
                f.write(data)
        else:
            r = requests.get(img_src)
            with open(DEST_PATH, "wb") as f:
                f.write(r.content)
        print("✅ Got Zootopia 2!")
    browser.close()
