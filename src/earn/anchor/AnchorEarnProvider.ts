import { AnchorEarn, CHAINS, DENOMS, NETWORKS, OperationError, Output } from '@anchor-protocol/anchor-earn';
import store from '../../store';
import { EarnProvider } from '../EarnProvider';

class AnchorEarnProvider extends EarnProvider {
  client: AnchorEarn;

  constructor({ network }: { network: string }) {
    super();

    this.client = new AnchorEarn({
      chain: CHAINS.TERRA,
      network: network === 'mainnet' ? NETWORKS.COLUMBUS_5 : NETWORKS.BOMBAY_12,
      mnemonic: store.state.wallets[0].mnemonic,
    });
  }

  public async getApy(): Promise<string> {
    const marketInfo = await this.client.market({
      currencies: [DENOMS.UST],
    });

    const { APY } = marketInfo.markets[0];

    const percentage = APY.split('.')[1];
    const formatted = percentage.slice(0, 2) + '.' + percentage.slice(2, 4);

    return formatted;
  }

  public async getDepositedAmount(): Promise<number> {
    const balanceInfo = await this.client.balance({
      currencies: [DENOMS.UST],
    });

    return Number(balanceInfo.balances[0].deposit_balance);
  }

  public async deposit(amount: string): Promise<Output | OperationError> {
    return await this.client.deposit({
      currency: DENOMS.UST,
      amount,
    });
  }

  public async withdraw(amount: string): Promise<Output | OperationError> {
    return await this.client.withdraw({
      currency: DENOMS.UST,
      amount,
    });
  }
}

export { AnchorEarnProvider };
