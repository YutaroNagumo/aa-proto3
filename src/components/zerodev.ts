const { Contract, Wallet } = require('ethers')
const { getZeroDevSigner } = require('@zerodevapp/sdk')
const ethers = require('ethers');

const projectId = "65c3edab-389f-4b50-a004-f95eed834ed6"
const wallet = new Wallet("0x8e9a8e453feac836634af17b3efe4fb3be1f50c263c48a9bcb352a47015f6e7e")

// const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'
// const contractABI = [
//   'function mint(address _to) public',
//   'function balanceOf(address owner) external view returns (uint256 balance)'
// ]

const sendOperationAndGetHash_z = async () => {
  const signer = await getZeroDevSigner({
    projectId,
    owner: wallet,
  })

  //開始時間get
  const startTime = Date.now();
  console.log(startTime);

  const address = await signer.getAddress()
  console.log('My address:', address)

  // const nftContract = new Contract(contractAddress, contractABI, signer)
  // const receipt = await nftContract.mint(address)
  
  const receipt = await signer.sendTransaction({
    gasLimit: "0x55555",
    to: '0x105286463682bF73D0E753f471dBC5E85d098181',
    data: "0x",
    value: ethers.utils.parseEther('0.000002'),
  });
  await receipt.wait()

  //終了時間get
  const endTime = Date.now();
  console.log(endTime);

  const runtime = Math.abs(endTime - startTime) / 1000;

  //Tx Hash獲得
  console.log("UOHash: ",receipt.hash);
  const response = await fetch(`/api/scrapeJiffy?hash=${receipt.hash}`);
  const data = await response.json();
  console.log("data: ",data);
  const txHash = data.transactionHash;
  console.log(data.transactionHash);

//   return [address, contractAddress, startTime, endTime, receipt.hash, txHash];
  return [runtime, receipt.hash, data.transactionHash];

}
export default sendOperationAndGetHash_z;
