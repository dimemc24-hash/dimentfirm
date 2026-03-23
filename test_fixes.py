import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("pageerror", lambda err: print(f"[ERROR] {str(err)[:200]}"))

    # Login first
    page.goto("http://localhost:5174/login", wait_until="networkidle", timeout=15000)
    page.fill('#email', 'dimemc24')
    page.fill('#password', 'Bounty24')
    page.click('button[type="submit"]')
    page.wait_for_timeout(2000)

    # Test 1: Course link -> Module page
    page.goto("http://localhost:5174/module/01-fresh-start", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(2000)
    page.screenshot(path="/tmp/fix_course.png", full_page=True)
    print(f"Course page URL: {page.url}")

    # Test 2: Arcade page
    page.goto("http://localhost:5174/arcade", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/fix_arcade.png", full_page=True)
    print(f"Arcade page URL: {page.url}")

    # Test 3: Lesson with reflection
    page.goto("http://localhost:5174/module/01-fresh-start/lesson/1", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(3000)
    page.screenshot(path="/tmp/fix_lesson.png", full_page=True)

    # Scroll to bottom to find reflection
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/fix_reflection.png", full_page=True)

    browser.close()
