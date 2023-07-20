// Imports the Alchemy SDK
const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");
const dotenv = require("dotenv");
dotenv.config();

//Replace with your own private key
const PRIVATE_KEY =  process.env.NEXT_PUBLIC_PRIVATE_KEY;

// Configures the Alchemy SDK
const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY, // Replace with your API key
    network: Network.MATIC_MUMBAI, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);
console.log("alchemy:",alchemy)

const wallet = new Wallet(PRIVATE_KEY);
console.log("wallet:",wallet.getAddress())

async function sendOperationAndGetHash_n() {
    // define the transaction
    const transaction = {
        to: "0xE15967C015C68c7E26F606411f9174376002aDcC",
        value: Utils.parseEther("0.001"),
        gasLimit: "21000",
        maxPriorityFeePerGas: Utils.parseUnits("1", "gwei"),
        maxFeePerGas: Utils.parseUnits("20", "gwei"),
        nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
        type: 2,
        chainId: 80001, // Corresponds to ETH_GOERLI
    };
    //開始時間
    const startTime = Date.now();

    const rawTransaction = await wallet.signTransaction(transaction);
    const response = await alchemy.transact.sendTransaction(rawTransaction)

    //終了時間
    const endTime = Date.now();

    const runtime = Math.abs(endTime - startTime) / 1000;
    // Return the response
    return [runtime,response.hash];
}

export default sendOperationAndGetHash_n;
