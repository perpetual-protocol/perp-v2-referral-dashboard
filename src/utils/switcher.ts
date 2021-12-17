import { JsonRpcProvider } from "@ethersproject/providers";

export async function switchToOptimism(provider: JsonRpcProvider) {
  const params = [
    {
      chainId: "0xA",
      chainName: "Optimistic Ethereum",
      rpcUrls: ["https://mainnet.optimism.io/"],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://optimistic.etherscan.io/"],
    },
  ];
  await provider.send("wallet_addEthereumChain", params);
}
