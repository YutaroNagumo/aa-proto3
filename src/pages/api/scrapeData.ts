import puppeteer from 'puppeteer';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { transactionHash } = req.body;

  try {
    const fee = await scrapeTransactionFee(transactionHash);
    res.status(200).json({ fee });
  } catch (error) {
    console.error('Error scraping transaction fee:', error);
    res.status(500).json({ error: 'Failed to scrape transaction fee' });
  }
}

export async function scrapeTransactionFee(transactionHash: string) {
    try {
    const url = `https://mumbai.polygonscan.com/tx/${transactionHash}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    console.log("page:",page)
    await page.waitForSelector('#ContentPlaceHolder1_spanTxFee > span', { timeout: 60000 });
    
    const feeText = await page.$eval('#ContentPlaceHolder1_spanTxFee > span', el => el.textContent);
    console.log("feeText:",feeText)
    // If feeText is null, return null immediately
    if (feeText === null) {
        await browser.close();
        return null;
    }

    // Regular expression to match the pattern
    const feePattern = /(\d+\.\d+) MATIC/;
    const matches = feeText.match(feePattern);

    // If there is a match, return the first group (the fee), otherwise return null
    const fee = matches ? matches[1] : null;

    await browser.close();
    return fee;} catch (error) {
        console.error('Error scraping transaction fee:', error);

        throw error; // エラーを再スローしてハンドラーに渡す
      }
    }