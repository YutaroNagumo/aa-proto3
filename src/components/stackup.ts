// Imports the Alchemy SDK
import { Client, Presets } from "userop";
import {
    parseEther,
  } from "ethers-latest";
const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");
const dotenv = require("dotenv");
dotenv.config();
const PRIVATE_KEY =  process.env.NEXT_PUBLIC_PRIVATE_KEY;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const pmUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;
const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const simpleAccountFactory = "0x9406Cc6185a346906296840746125a0E44976454";
const pmContext = {
    type: "payg",
  };
  if (!rpcUrl) {
    throw new Error("RPC_URL is undefined");
  }

  if (!pmUrl) {
    throw new Error("PAYMASTER_RPC_URL is undefined");
  }
const paymaster = true
    ? Presets.Middleware.verifyingPaymaster(pmUrl, pmContext)
    : undefined;
  const createAccount = async (PRIVATE_KEY: string) => {
    return await Presets.Builder.SimpleAccount.init(
      new Wallet(PRIVATE_KEY) as any,
      rpcUrl,
      entryPoint,
      simpleAccountFactory,
      paymaster
    );
  };

  ///以下関数を真似て他のTx種類に関しても実装する
  async function sendOperationAndGetHash_s() {
    if (!rpcUrl) {
        throw new Error("RPC_URL is undefined");
      }
    if (!PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY is undefined");
    }
    const account = await createAccount(PRIVATE_KEY);
    //開始時間get
    const startTime = Date.now();
    console.log("startTime: ",startTime);

    const client = await Client.init(rpcUrl, entryPoint);

    const target = "0x105286463682bF73D0E753f471dBC5E85d098181";
    const amount = "0.00001";
    const value = parseEther(amount);
    const res = await client.sendUserOperation(
      account.execute(target, value, "0x"),
      {
        onBuild: async (op) => {
        },
      }
    );

    const ev = await res.wait();
    console.log(ev);
    //終了時間get
    const endTime = Date.now();
    console.log("endTime: ",endTime);

    const runtime = Math.abs(endTime - startTime) / 1000;
    const UserOperationHash = res.userOpHash;
    const transactionHash = ev?.transactionHash ?? null;
    return [runtime,UserOperationHash, transactionHash]; // hashを返す
  };

  export default sendOperationAndGetHash_s;
