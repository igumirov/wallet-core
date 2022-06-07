import { EIP1559FeeProvider, RpcFeeProvider } from '@chainify/evm';
import { AccountInfo, Network } from '../../store/types';
import { HTLC_CONTRACT_ADDRESS } from '../../utils/chainify';
import { ChainNetworks } from '../../utils/networks';
import { createEVMClient } from './clients';

const defaultSwapOptions = {
  contractAddress: HTLC_CONTRACT_ADDRESS,
};

export function createEthClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const ethNetwork = ChainNetworks.ethereum[network];
  const feeProvider = new EIP1559FeeProvider(ethNetwork.rpcUrl as string);
  return createEVMClient(ethNetwork, feeProvider, mnemonic, accountInfo, defaultSwapOptions);
}

export function createRskClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const rskNetwork = ChainNetworks.rsk[network];
  const feeProvider = new RpcFeeProvider(rskNetwork.rpcUrl, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  const swapOptions = {
    ...defaultSwapOptions,
    gasLimitMargin: 3000, // 30%;
  };

  return createEVMClient(rskNetwork, feeProvider, mnemonic, accountInfo, swapOptions);
}

export function createBSCClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const bscNetwork = ChainNetworks.bsc[network];

  const feeProvider = new RpcFeeProvider(bscNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 2,
    fastMultiplier: 2.2,
  });

  return createEVMClient(bscNetwork, feeProvider, mnemonic, accountInfo, defaultSwapOptions);
}

export function createPolygonClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const polygonNetwork = ChainNetworks.polygon[network];

  const feeProvider =
    network === Network.Testnet
      ? new EIP1559FeeProvider(polygonNetwork.rpcUrl as string)
      : new RpcFeeProvider(polygonNetwork.rpcUrl as string, {
          slowMultiplier: 1,
          averageMultiplier: 2,
          fastMultiplier: 2.2,
        });

  return createEVMClient(
    polygonNetwork,
    feeProvider,
    mnemonic,
    accountInfo,
    defaultSwapOptions
  );
}

export function createArbitrumClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const arbitrumNetwork = ChainNetworks.arbitrum[network];

  const feeProvider = new RpcFeeProvider(arbitrumNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(
    arbitrumNetwork,
    feeProvider,
    mnemonic,
    accountInfo,
    defaultSwapOptions
  );
}

export function createAvalancheClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const avalancheNetwork = ChainNetworks.avalanche[network];

  const feeProvider = new RpcFeeProvider(avalancheNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 2,
    fastMultiplier: 2.2,
  });

  return createEVMClient(
    avalancheNetwork,
    feeProvider,
    mnemonic,
    accountInfo,
    defaultSwapOptions
  );
}

export function createFuseClient(network: Network, mnemonic: string, accountInfo: AccountInfo) {
  const fuseNetwork = ChainNetworks.fuse[network];

  const feeProvider = new RpcFeeProvider(fuseNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(fuseNetwork, feeProvider, mnemonic, accountInfo, defaultSwapOptions);
}