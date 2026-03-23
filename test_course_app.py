from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console errors
    errors = []
    page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type in ("error", "warning") else None)
    page.on("pageerror", lambda err: errors.append(f"[PAGE ERROR] {err}"))

    page.goto("http://localhost:5174", wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(3000)

    # Screenshot
    page.screenshot(path="/tmp/course_app.png", full_page=True)

    # Check what rendered
    content = page.content()
    root = page.locator("#root")
    print(f"Root inner HTML length: {len(root.inner_html())}")
    print(f"Root text: '{root.inner_text()[:500]}'")

    # Print all console errors
    print(f"\n--- Console errors ({len(errors)}) ---")
    for e in errors:
        print(e)

    browser.close()
