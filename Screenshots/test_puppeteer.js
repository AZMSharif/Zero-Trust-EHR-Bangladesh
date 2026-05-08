const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('response', async response => {
    if (response.url().includes('/api/')) {
      console.log('API RESPONSE:', response.url(), response.status());
      try {
        const text = await response.text();
        console.log('API BODY:', text);
      } catch(e) {}
    }
  });

  try {
    await page.goto('https://medibridge-ehr.vercel.app/doctor/login', { waitUntil: 'networkidle0' });
    console.log("Navigated to login page.");
    
    await page.type('input[type="text"]', 'A-56789');
    await page.type('input[type="password"]', 'doctor123');
    
    console.log("Filled form. Clicking login...");
    await page.click('button[type="submit"]');
    
    // Wait longer to see the OTP page load and request OTP
    await new Promise(r => setTimeout(r, 6000));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
