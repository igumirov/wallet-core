<<<<<<< HEAD
import { Transaction } from '@chainify/types';
=======
>>>>>>> master
import { chains } from '@liquality/cryptoassets';
import BN, { BigNumber } from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { assetsAdapter } from '../../utils/chainify';
import { createHistoryNotification } from '../broker/notification';
import { AccountId, Asset, FeeLabel, Network, SendHistoryItem, SendStatus, TransactionType, WalletId } from '../types';
import {ChainId} from "@liquality/cryptoassets/src/types";

export const sendTransaction = async (
  context: ActionContext,
  {
    network,
    walletId,
    accountId,
    asset,
    to,
    amount,
    data,
    fee,
    gas,
    feeLabel,
    fiatRate,
  }: {
    network: Network;
    walletId: WalletId;
    accountId: AccountId;
    asset: Asset;
    to: Asset;
    amount: BigNumber;
    data: string;
    fee: number;
    gas: number;
    feeLabel: FeeLabel;
    fiatRate: number;
  }
): Promise<SendHistoryItem> => {
  const { dispatch, commit, getters } = rootActionContext(context);
  const client = getters.client({ network, walletId, asset, accountId });

  const _asset = assetsAdapter(asset)[0];
  const tx = await client.wallet.sendTransaction({
<<<<<<< HEAD
    to: chains[_asset.chain].formatAddress(to),
=======
    to: chains[_asset.chain as ChainId].formatAddress(to),
>>>>>>> master
    value: new BN(amount),
    data,
    gasLimit: gas,
    fee,
    asset: _asset,
    feeAsset: _asset,
  });

  const transaction: SendHistoryItem = {
    id: uuidv4(),
    type: TransactionType.Send,
    network,
    walletId,
    to: asset,
    from: asset,
    toAddress: to,
    amount: new BN(amount).toFixed(),
    fee,
    tx,
    txHash: tx.hash,
    startTime: Date.now(),
    status: SendStatus.WAITING_FOR_CONFIRMATIONS,
    accountId,
    feeLabel,
    fiatRate,
  };

  commit.NEW_TRASACTION({ network, walletId, transaction });

  dispatch.performNextAction({ network, walletId, id: transaction.id });

  createHistoryNotification(transaction);

  return transaction;
};
