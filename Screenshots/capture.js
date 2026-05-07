const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:4173';
const OUT_DIR = path.join(__dirname, 'output');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });
  const page = await browser.newPage();

  // ── 01  Landing Page (English) ──
  console.log('01 → Landing Page (English)');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await delay(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '01_LandingPage_English.png'), fullPage: true });

  // ── 02  Landing Page (Bangla) ──
  console.log('02 → Landing Page (Bangla)');
  await page.evaluate(() => {
    const btn = document.querySelector('button.fixed');
    if (btn) btn.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '02_LandingPage_Bangla.png'), fullPage: true });

  // Toggle back to English
  await page.evaluate(() => {
    const btn = document.querySelector('button.fixed');
    if (btn) btn.click();
  });
  await delay(800);

  // ── 03  Doctor Login ──
  console.log('03 → Doctor Login');
  await page.goto(`${BASE_URL}/doctor/login`, { waitUntil: 'networkidle2' });
  await delay(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '03_DoctorLogin.png'), fullPage: true });

  // Fill credentials and submit
  console.log('   Filling Doctor Credentials...');
  const inputs = await page.$$('input');
  await inputs[0].type('A-56789');
  await inputs[1].type('doctor123');
  await page.click('button[type="submit"]');

  // Wait for navigation to /doctor/otp
  console.log('   Waiting for OTP Gate...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await delay(1500);

  // ── 04  OTP Gate Step 1 ──
  console.log('04 → OTP Gate Step 1');
  await page.screenshot({ path: path.join(OUT_DIR, '04_OtpGate_Step1.png'), fullPage: true });

  // Enter the patient URN
  console.log('   Entering Patient URN...');
  const urnInput = await page.$('input.glass-input');
  if (urnInput) {
    // Get the first patient URN from the database
    await urnInput.type('cmovwcaup000dqaa4pskd0yts');
    await page.click('button[type="submit"]');
  }

  // Wait for Step 2 to render
  console.log('   Waiting for OTP Step 2...');
  await delay(3000);

  // ── 05  OTP Gate Step 2 ──
  console.log('05 → OTP Gate Step 2 (with Demo OTP)');
  await page.screenshot({ path: path.join(OUT_DIR, '05_OtpGate_Step2_WithOTP.png'), fullPage: true });

  // Extract the demo OTP
  let otpCode = '123456';
  try {
    const demoOtpEl = await page.$('p.text-amber-400');
    if (demoOtpEl) {
      const demoOtpText = await page.evaluate(el => el.innerText, demoOtpEl);
      console.log('   Found Demo OTP Text:', demoOtpText);
      const match = demoOtpText.match(/(\d{6})/);
      if (match) otpCode = match[1];
    }
  } catch (e) {
    console.log('   Could not extract OTP, using fallback 123456');
  }

  // Enter the OTP
  console.log('   Entering OTP:', otpCode);
  const otpInput = await page.$('input.text-center');
  if (otpInput) {
    await otpInput.type(otpCode);
    await page.click('button[type="submit"]');
  }

  // Wait for dashboard navigation
  console.log('   Waiting for Doctor Dashboard...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await delay(2500);

  // ── 06  Doctor Dashboard (English) ──
  console.log('06 → Doctor Dashboard (English)');
  await page.screenshot({ path: path.join(OUT_DIR, '06_DoctorDashboard_English.png'), fullPage: true });

  // ── 06b  Doctor Upload Modal ──
  console.log('06b → Doctor Upload Modal');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const uploadBtn = btns.find(b => b.innerText.includes('Upload') || b.innerText.includes('আপলোড'));
    if (uploadBtn) uploadBtn.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '06b_DoctorDashboard_UploadModal.png'), fullPage: true });

  // Close modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find(b => b.innerText.includes('Cancel') || b.innerText.includes('বাতিল'));
    if (cancelBtn) cancelBtn.click();
  });
  await delay(800);

  // ── 07  Doctor Dashboard (Bangla) ──
  console.log('07 → Doctor Dashboard (Bangla)');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const langBtn = btns.find(b => b.innerText.includes('বাংলা') || b.innerText.includes('English'));
    if (langBtn) langBtn.click();
  });
  await delay(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '07_DoctorDashboard_Bangla.png'), fullPage: true });

  // Logout Doctor
  console.log('   Logging out Doctor...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const logoutBtn = btns.find(b => b.innerText.includes('Logout') || b.innerText.includes('লগআউট'));
    if (logoutBtn) logoutBtn.click();
  });
  await delay(1500);

  // ── 08  Patient Login ──
  console.log('08 → Patient Login');
  await page.goto(`${BASE_URL}/patient/login`, { waitUntil: 'networkidle2' });
  await delay(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '08_PatientLogin.png'), fullPage: true });

  // Fill patient credentials
  console.log('   Filling Patient Credentials...');
  const patientInputs = await page.$$('input');
  if (patientInputs.length >= 2) {
    await patientInputs[0].type('cmovwcaup000dqaa4pskd0yts');
    await patientInputs[1].type('patient123');
    await page.click('button[type="submit"]');
  }

  // Wait for patient dashboard
  console.log('   Waiting for Patient Dashboard...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await delay(2500);

  // ── 09  Patient Dashboard (English) ──
  console.log('09 → Patient Dashboard (English)');
  await page.screenshot({ path: path.join(OUT_DIR, '09_PatientDashboard_English.png'), fullPage: true });

  // ── 09b  Patient Upload Modal ──
  console.log('09b → Patient Upload Modal');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const uploadBtn = btns.find(b => b.innerText.includes('Upload') || b.innerText.includes('আপলোড'));
    if (uploadBtn) uploadBtn.click();
  });
  await delay(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '09b_PatientDashboard_UploadModal.png'), fullPage: true });

  // Close modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find(b => b.innerText.includes('Cancel') || b.innerText.includes('বাতিল'));
    if (cancelBtn) cancelBtn.click();
  });
  await delay(800);

  // ── 10  Patient Dashboard (Bangla) ──
  console.log('10 → Patient Dashboard (Bangla)');
  await page.evaluate(() => {
    const btn = document.querySelector('button.fixed');
    if (btn) btn.click();
  });
  await delay(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '10_PatientDashboard_Bangla.png'), fullPage: true });

  console.log('\n✅ Done! All 12 screenshots saved to:', OUT_DIR);
  await browser.close();
}

run().catch(console.error);
