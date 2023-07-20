//banana用
import { Banana, Chains } from "@rize-labs/banana-wallet-sdk";
import { ethers } from "ethers";

 // This default export is required in a new `pages/_app.js` file.
 async function sendOperationAndGetHash_b() {
    const bananaInstance = new Banana(Chains.shibuyaTestnet);
  
    // checking does wallet name is cached in cookie 
    const walletName = "yuta"
    // if cached we will use it 
    // connect wallet with cached wallet name
    const wallet = await bananaInstance.connectWallet(walletName);
    // extracting wallet address for display purpose
    const address = await wallet.getAddress();
    console.log("address:",address);
    // getting signer
      const signer = wallet.getSigner();
      const amount = "0.0000000000005";
      const tx = {
        gasLimit: "0x55555",
        to: "0xE15967C015C68c7E26F606411f9174376002aDcC",
        value: ethers.utils.parseEther(amount),
        data: "0x",
      }
      console.log("tx:",tx);
      try {
        // sending txn object via signer
        //開始時間get
        const startTime = Date.now();
        const txn = await signer.sendTransaction(tx);
        //終了時間get
        const endTime = Date.now();
        const runtime = Math.abs(endTime - startTime) / 1000;
        const output = (JSON.stringify(txn));
        console.log("output:",output);

        const parsedOutput = JSON.parse(output);
        const txHash = parsedOutput.hash;

        return [runtime,txHash]; // hashを返す
      } catch (err) {
        console.log(err);
      }

    };


    export default sendOperationAndGetHash_b;
