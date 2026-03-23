from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("pageerror", lambda err: print(f"[ERROR] {str(err)[:200]}"))

    # Go directly to the game
    page.goto("http://localhost:5174/game/budget-crisis", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(2000)
    page.screenshot(path="/tmp/budget_intro.png", full_page=True)

    # Click Start Month
    start_btn = page.locator("text=Start Month")
    if start_btn.count() > 0:
        start_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="/tmp/budget_week1.png", full_page=True)

        # Click Review Bills
        review_btn = page.locator("text=Review Bills")
        if review_btn.count() > 0:
            review_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="/tmp/budget_bills.png", full_page=True)

    browser.close()
