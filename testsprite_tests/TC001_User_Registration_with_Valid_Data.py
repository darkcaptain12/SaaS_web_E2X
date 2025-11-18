import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3001", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on the 'Kayıt Ol' link to go to the registration page.
        frame = context.pages[-1]
        # Click on 'Kayıt Ol' link to navigate to the registration page.
        elem = frame.locator('xpath=html/body/nav/div/div/div[2]/a[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the registration form with valid personal and business information.
        frame = context.pages[-1]
        # Fill in the 'Ad Soyad' (Name) field with valid name.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test User')
        

        frame = context.pages[-1]
        # Fill in the 'Email Adresi' (Email) field with valid email.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('e2xldigital@gmail.com')
        

        frame = context.pages[-1]
        # Fill in the 'Şifre' (Password) field with valid password.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        # Fill in the 'Telefon' (Phone) field with valid phone number.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div[4]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('+905551234567')
        

        frame = context.pages[-1]
        # Fill in the 'İşletme Adı' (Business Name) field with valid business name.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div[5]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test Business')
        

        # -> Click the 'Hesap Oluştur' button to submit the registration form.
        frame = context.pages[-1]
        # Click the 'Hesap Oluştur' button to submit the registration form.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Clear the email field and input a new unique email address to retry registration.
        frame = context.pages[-1]
        # Clear the 'Email Adresi' field to input a new unique email.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        # -> Input a new unique email address into the email field.
        frame = context.pages[-1]
        # Input a new unique email address to retry registration.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('uniqueuser12345@example.com')
        

        # -> Click the 'Hesap Oluştur' button to submit the registration form with the new unique email.
        frame = context.pages[-1]
        # Click the 'Hesap Oluştur' button to submit the registration form with new unique email.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Log in with the newly registered user credentials to verify successful registration and USER role assignment.
        frame = context.pages[-1]
        # Input the registered email to login.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('uniqueuser12345@example.com')
        

        frame = context.pages[-1]
        # Input the password to login.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        # Click the 'Giriş Yap' button to log in.
        elem = frame.locator('xpath=html/body/main/div/div/div[2]/form/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Check user profile or account settings to verify the assigned USER role.
        frame = context.pages[-1]
        # Click on 'Panel' link to access user panel or profile settings to verify user role.
        elem = frame.locator('xpath=html/body/nav/div/div/div[2]/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Hoş geldiniz, Test User! 👋').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Kullanıcı Panel').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Aktif deneme bulunmuyor').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Aktif abonelik bulunmuyor').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    