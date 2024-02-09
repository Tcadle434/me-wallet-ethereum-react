import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import { utils } from "ethers";

/**
 * Send 1 wei from the connected wallet to itself
 * @param {Web3Provider} provider a web3 provider
 * @returns {Promise<TransactionResponse>} a raw transaction object
 */
export async function sendTransaction(
  provider: Web3Provider
): Promise<TransactionResponse> {
  try {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const gasPrice = await provider.getGasPrice();
    const transactionParameters = {
      nonce: await provider.getTransactionCount(address),
      gasPrice,
      gasLimit: utils.hexlify(100000),
      to: address,
      from: address,
      value: utils.parseUnits("1", "wei"),
    };
    return signer.sendTransaction(transactionParameters);
  } catch (error) {
    console.warn(error);
    throw new Error("Error sending transaction");
  }
}
