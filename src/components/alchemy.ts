import {
    SimpleSmartContractAccount,
    SmartAccountProvider,
    type SimpleSmartAccountOwner,
  } from "@alchemy/aa-core";
const {Wallet, Utils } = require("alchemy-sdk");
import { polygonMumbai } from "viem/chains";
import { toHex } from "viem";
import { AlchemyProvider } from "@alchemy/aa-alchemy";


  const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
    "0x9406Cc6185a346906296840746125a0E44976454";
  const PRIVATE_KEY =  process.env.NEXT_PUBLIC_PRIVATE_KEY;
  const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  const RPCURL = "https://polygon-mumbai.g.alchemy.com/v2/" + ALCHEMY_KEY;
  const ALCHEMY_GASKEY = process.env.NEXT_PUBLIC_ALCHEMY_GASKEY;
  console.log("RPCURL: ",RPCURL);
  const wallet = new Wallet(PRIVATE_KEY);
  

  if (!ALCHEMY_KEY) {
    throw new Error('NEXT_PUBLIC_ALCHEMY_KEY is not set');
  }
  if (!ALCHEMY_GASKEY) {
    throw new Error('NEXT_PUBLIC_ALCHEMY_GASKEY is not set');
  }

  
  
//   const provider = new SmartAccountProvider(
//     RPCURL, // rpcUrl
//     "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // entryPointAddress
//     polygonMumbai // chain
//   ).connect(
//     (rpcClient) =>
//     new SimpleSmartContractAccount({
//       owner: wallet,
//       entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
//       chain: polygonMumbai,
//       factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
//       rpcClient,
//       // optionally if you already know the account's address
//       accountAddress: "0xF7EE215F58A4E2a6E58429837B95B979a3E15ce1",
//     })
// );
const provider = new AlchemyProvider({
  apiKey: ALCHEMY_KEY,
  chain: polygonMumbai,
  entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
}).connect(
  (rpcClient) =>
    new SimpleSmartContractAccount({
      entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      chain: polygonMumbai, // ether a viem Chain or chainId that supports account abstraction at Alchemy
      owner: wallet,
      factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      rpcClient,
    })
);

// [OPTIONAL] Use Alchemy Gas Manager
const prpvider = provider.withAlchemyGasManager({
  provider: provider.rpcClient,
  policyId: ALCHEMY_GASKEY,
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
});

console.log("prpvider:",prpvider.getAddress())

// 3. send a transaction
async function sendOperationAndGetHash_a() {
    try {
      const operationData = {
        target: "0xE15967C015C68c7E26F606411f9174376002aDcC" as `0x${string}`,
        data: "0x" as `0x${string}`,
        value: Utils.parseEther("0.00001"),
      };
      //開始時間
      const startTime = Date.now();
      const result = await prpvider.sendUserOperation(operationData);
      //終了時間
      const endTime = Date.now();

      const runtime = Math.abs(endTime - startTime) / 1000;

      const { hash } = result;

      //Tx Hash獲得
      console.log("UOHash: ",hash);
      //jiffyscanの調子が悪いので一旦スクレイピング中止
      const response = await fetch(`/api/scrapeJiffy?hash=${hash}`);
      const data = await response.json();
      console.log("data: ",data);
      const txHash = data.transactionHash;
      console.log(data.transactionHash);

      return [runtime,hash,data.transactionHash]; // hashを返す
    } catch (error) {
      // エラーハンドリングをする
      console.error(error); // エラー情報をログに出力
      return null; // エラーが発生した場合はnullを返す（または適切なエラーハンドリングを行う）
  }
  
  }
  
//   sendOperationAndGetHash().then(hash => {
//     // ここでhashを使う
//     console.log(hash);  });

export default sendOperationAndGetHash_a;
