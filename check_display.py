from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

# Set up the WebDriver
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

# Open the URL (replace with the local path if testing locally)
driver.get("https://ivs.id.vn/pages/about.html")

# Check for any console errors
logs = driver.get_log('browser')
for log in logs:
    print(log)

# Close the browser
driver.quit()
