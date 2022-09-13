import BigNumber from 'bignumber.js';
import Bluebird from 'bluebird';
import { ActionContext } from '..';
import buildConfig from '../../build.config';
import { getSwapProvider } from '../../factory/swap';
import { QuoteRequestUIData, SwapQuote } from '../../swaps/types';
import { SwapProviderType } from '../types';

// TODO: is this an action at this point? Or should it be in utils
export const getQuotes = async (
  _context: ActionContext,
  {
    network,
    from,
    to,
    fromAccountId,
    toAccountId,
    walletId,
    // Amount is string because in some contexts, it is passed over messages not supporting full objects
    amount,
  }: QuoteRequestUIData
): Promise<SwapQuote[]> => {
  if (!amount) {
    return [];
  }
  const quotes = await Bluebird.map(
    Object.keys(buildConfig.swapProviders[network]),
    async (provider: SwapProviderType) => {
      const swapProvider = getSwapProvider(network, provider);
      // Quote errors should not halt the process
      const quote = await swapProvider
        .getQuote({ network, from, to, amount: new BigNumber(amount), fromAccountId, toAccountId, walletId })
        .catch(console.error);
      return quote ? { ...quote, from, to, provider, fromAccountId, toAccountId } : null;
    },
    { concurrency: 5 }
  );

  // Null quotes filtered
  return quotes.filter((quote) => quote) as SwapQuote[];
};
