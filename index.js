const { chromium } = require('playwright');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN);
const PRODUCT_URL = 'https://www.onenessboutique.com/products/fear-of-god-essentials-bonded-nylon-soccer-shorts-in-desert-sand-160ho244377f';
const ORIGINAL_PRICE = 90;

async function checkDiscount() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(PRODUCT_URL, { waitUntil: 'networkidle' });

  await page.click('input[value="XL"]');
  await page.click('button[name="add"]');
  await page.waitForTimeout(2000);
  await page.goto('https://www.onenessboutique.com/checkout', { waitUntil: 'networkidle' });

  const priceText = await page.locator('.payment-due__price').textContent();
  const currentPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));

  if (currentPrice < ORIGINAL_PRICE) {
    await bot.sendMessage(process.env.CHAT_ID, `💸 할인 감지됨: $${currentPrice}`);
  }

  await browser.close();
}

checkDiscount();
