import { EIP1559FeeProvider, RpcFeeProvider } from '@chainify/evm';
import { AccountType, Network } from '../../store/types';
import { ChainNetworks } from '../../utils/networks';
import { createEVMClient } from './clients';

export function createEthClient(
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string
) {
  const ethNetwork = ChainNetworks.ethereum[network];
  const feeProvider = new EIP1559FeeProvider(ethNetwork.rpcUrl as string);
  return createEVMClient(ethNetwork, feeProvider, mnemonic, accountType, derivationPath);
}

export function createRskClient(
  network: Network,
  mnemonic: string,
  accountType: AccountType,
  derivationPath: string
) {
  const rskNetwork = ChainNetworks.rsk[network];
  const feeProvider = new RpcFeeProvider(rskNetwork.rpcUrl, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(rskNetwork, feeProvider, mnemonic, accountType, derivationPath);
}

export function createBSCClient(network: Network, mnemonic: string, derivationPath: string) {
  const bscNetwork = ChainNetworks.bsc[network];

  const feeProvider = new RpcFeeProvider(bscNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 2,
    fastMultiplier: 2.2,
  });

  return createEVMClient(bscNetwork, feeProvider, mnemonic, AccountType.Default, derivationPath);
}

export function createPolygonClient(network: Network, mnemonic: string, derivationPath: string) {
  const polygonNetwork = ChainNetworks.polygon[network];

  const feeProvider =
    network === Network.Testnet
      ? new EIP1559FeeProvider(polygonNetwork.rpcUrl as string)
      : new RpcFeeProvider(polygonNetwork.rpcUrl as string, {
          slowMultiplier: 1,
          averageMultiplier: 2,
          fastMultiplier: 2.2,
        });

  return createEVMClient(polygonNetwork, feeProvider, mnemonic, AccountType.Default, derivationPath);
}

export function createArbitrumClient(network: Network, mnemonic: string, derivationPath: string) {
  const arbitrumNetwork = ChainNetworks.arbitrum[network];

  const feeProvider = new RpcFeeProvider(arbitrumNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(arbitrumNetwork, feeProvider, mnemonic, AccountType.Default, derivationPath);
}

export function createAvalancheClient(network: Network, mnemonic: string, derivationPath: string) {
  const avalancheNetwork = ChainNetworks.avalanche[network];

  const feeProvider = new RpcFeeProvider(avalancheNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 2,
    fastMultiplier: 2.2,
  });

  return createEVMClient(avalancheNetwork, feeProvider, mnemonic, AccountType.Default, derivationPath);
}

export function createFuseClient(network: Network, mnemonic: string, derivationPath: string) {
  const fuseNetwork = ChainNetworks.fuse[network];

  const feeProvider = new RpcFeeProvider(fuseNetwork.rpcUrl as string, {
    slowMultiplier: 1,
    averageMultiplier: 1,
    fastMultiplier: 1.25,
  });

  return createEVMClient(fuseNetwork, feeProvider, mnemonic, AccountType.Default, derivationPath);
}