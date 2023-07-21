import { NextApiRequest, NextApiResponse } from 'next';
import { createObjectCsvWriter } from 'csv-writer';
import { scrapeTransactionFee } from './scrapeData';

const { Network, Alchemy } = require("alchemy-sdk");
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(settings);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// CSVファイルのヘッダーを定義
const csvHeader = [
  { id: 'tool', title: 'ToolName' },
  { id: 'RunTime', title: 'RunTime' },
  { id: 'UserOperationHash', title: 'UserOperation Hash' },
  { id: 'transactionHash', title: 'Transaction Hash' },
  { id: 'GasFee', title: 'Gas Fee' },

];

const filePath = '../result.csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { data } = req.body;
  console.log("data:",data)
  
  //ガス代獲得
  const tx = data.transactionHash;
  // 反映まで30秒待機
  await sleep(40000);
  //時間経過待つ
  const receipt = await alchemy.core.getTransactionReceipt(tx);


  const gasUsed = receipt.effectiveGasPrice.toNumber();
  console.log("gasUsed:",gasUsed)
  data.GasFee = gasUsed;

  try {
    // CSVファイルに追記するデータを準備
    const records = [data];
    // CSVファイルへの追記
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: csvHeader,
      append: true, // 既存のファイルに追記するために `append: true` を設定する
    });

    await csvWriter.writeRecords(records);
    console.log('Data saved to result.csv');

    res.status(200).end();
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
}
