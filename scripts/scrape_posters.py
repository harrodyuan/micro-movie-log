import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import urllib.request

# Configuration
EMAIL = "harrodyuan@gmail.com"
PASSWORD = "@2002Yzf"
OUTPUT_DIR = "../public/posters"

# AMC URLs
LOGIN_URL = "https://www.amctheatres.com/amcstubs/login"
HISTORY_URL = "https://www.amctheatres.com/my-amc/tickets?past-events-range=1y&past-events-after=cGM6MToxMDo5"

def setup_driver():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') # Run in headless mode (no GUI)
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def login(driver):
    print("Navigating to login page...")
    driver.get(LOGIN_URL)
    
    try:
        # Wait for email field
        print("Waiting for login fields...")
        email_field = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "email-login-field"))
        )
        password_field = driver.find_element(By.ID, "password-login-field")
        
        print("Entering credentials...")
        email_field.send_keys(EMAIL)
        password_field.send_keys(PASSWORD)
        password_field.send_keys(Keys.RETURN)
        
        # Wait for login to complete (check for My AMC or similar)
        print("Waiting for login to complete...")
        time.sleep(5) # Simple wait for redirect, adjust as needed or use explicit wait
        
        # Check if we are still on login page (failed)
        if "login" in driver.current_url:
            print("Login might have failed or captcha triggered. Please check the browser window.")
            # time.sleep(60) # Give user time to solve captcha manually if not headless
    except Exception as e:
        print(f"Error during login: {e}")

def scrape_posters(driver):
    print(f"Navigating to history page: {HISTORY_URL}")
    driver.get(HISTORY_URL)
    time.sleep(5) # Wait for page load
    
    # Scroll down to load more items if necessary
    # driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    
    # Find all poster images
    # Note: Selectors depend on AMC's current DOM structure. 
    # Based on general knowledge, looking for images within ticket/event containers.
    # We might need to inspect the page to get exact selectors.
    # For now, I'll look for img tags that look like movie posters.
    
    images = driver.find_elements(By.TAG_NAME, "img")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    count = 0
    for img in images:
        src = img.get_attribute('src')
        alt = img.get_attribute('alt')
        
        # Filter for likely poster URLs (amc-theatres-res.cloudinary.com is common)
        if src and "cloudinary" in src and alt:
            filename = f"{alt.replace(' ', '_').replace(':', '').replace('/', '-')}.jpg"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            if not os.path.exists(filepath):
                print(f"Downloading poster for {alt}...")
                try:
                    urllib.request.urlretrieve(src, filepath)
                    count += 1
                except Exception as e:
                    print(f"Failed to download {alt}: {e}")
            else:
                print(f"Poster for {alt} already exists.")
                
    print(f"Downloaded {count} new posters.")

def main():
    driver = setup_driver()
    try:
        login(driver)
        scrape_posters(driver)
    finally:
        print("Closing driver...")
        driver.quit()

if __name__ == "__main__":
    main()
