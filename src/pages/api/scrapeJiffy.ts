import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const UserOpHash: string = req.query.hash as string;
  await sleep(40000); // 40秒待つ
  const url: string = `https://www.jiffyscan.xyz/userOpHash/${UserOpHash}?network=mumbai`;
  console.log("jiffy url: " ,url);

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537');
  await page.goto(url);
  
  // page.gotoの後に以下を追加します
  await page.waitForXPath('//*[@id="__next"]/div/div/div/div/div[3]/section/div/div[2]/div/section/div/div[10]/div[2]/div[2]/div/a[1]/span');


  const transactionHash: string | null = await page.evaluate(() => {
    const xpath = '//*[@id="__next"]/div/div/div/div/div[3]/section/div/div[2]/div/section/div/div[10]/div[2]/div[2]/div/a[1]/span';
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
    return element ? element.textContent : null;
  });
  await browser.close();

  res.status(200).json({ transactionHash });
}
