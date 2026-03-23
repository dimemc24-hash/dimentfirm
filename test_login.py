from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    errors = []
    page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error" else None)
    page.on("pageerror", lambda err: errors.append(f"[PAGE ERROR] {str(err)[:200]}"))

    # Go to login
    page.goto("http://localhost:5174/login", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/login_page.png", full_page=True)

    # Fill in test credentials
    page.fill('#email', 'dimemc24')
    page.fill('#password', 'Bounty24')
    page.screenshot(path="/tmp/login_filled.png", full_page=True)

    # Click sign in
    page.click('button[type="submit"]')
    page.wait_for_timeout(2000)
    page.screenshot(path="/tmp/after_login.png", full_page=True)

    print(f"URL after login: {page.url}")
    print(f"Page text (first 500): {page.inner_text('body')[:500]}")

    if errors:
        print(f"\n--- Errors ({len(errors)}) ---")
        for e in errors:
            try:
                print(e)
            except Exception:
                print("[encoding error in message]")

    browser.close()
