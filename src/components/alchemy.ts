import {
    SimpleSmartContractAccount,
    SmartAccountProvider,
    type SimpleSmartAccountOwner,
  } from "@alchemy/aa-core";
const {Wallet, Utils } = require("alchemy-sdk");
import { polygonMumbai } from "viem/chains";

  const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
    "0x9406Cc6185a346906296840746125a0E44976454";
    const PRIVATE_KEY =  process.env.NEXT_PUBLIC_PRIVATE_KEY;

  //wallet address : 0x859A3Cd6948e7BcC2FCb7A340d084F21ec1D41A0
  // 1. define the EOA owner of the Smart Account
  // This is just one exapmle of how to interact with EOAs, feel free to use any other interface
  const wallet = new Wallet(PRIVATE_KEY);
  // All that is important for defining an owner is that it provides a `signMessage` and `getAddress` function

  // 2. initialize the provider and connect it to the account
  const provider = new SmartAccountProvider(
    // the demo key below is public and rate-limited, it's better to create a new one
    // you can get started with a free account @ https://www.alchemy.com/
    "https://polygon-mumbai.g.alchemy.com/v2/wDwT-O3jfU0AjkVuNeEMYjjNqmPWAWTn", // rpcUrl
    "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // entryPointAddress
    polygonMumbai // chain
  ).connect(
    (rpcClient) =>
    new SimpleSmartContractAccount({
      owner: wallet,
      entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      chain: polygonMumbai,
      factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      rpcClient,
      // optionally if you already know the account's address
      accountAddress: "0xF7EE215F58A4E2a6E58429837B95B979a3E15ce1",
    })
);
console.log(provider.getAddress())

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
      const result = await provider.sendUserOperation(operationData);
      //終了時間
      const endTime = Date.now();

      const runtime = Math.abs(endTime - startTime) / 1000;

      const { hash } = result;
      return [runtime,hash]; // hashを返す
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
