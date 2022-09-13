/* eslint-disable @typescript-eslint/no-explicit-any */
import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
import ThirdPartyError, { UserActivity } from '../../LiqualityErrors/ThirdPartyError';
import InsufficientFundsError from '../../LiqualityErrors/InsufficientFundsError';
import InsufficientGasFeeError from '../../LiqualityErrors/InsufficientGasFeeError';
import InsufficientLiquidityError from '../../LiqualityErrors/InsufficientLiquidityError';
import InternalError from '../../LiqualityErrors/InternalError';
import UnknownError from '../../LiqualityErrors/UnknownError';
import { oneInchInternalErrReason, OneInchError, ONE_INCH_ERRORS, oneInchSwapSourceName } from '.';

export class OneInchSwapErrorParser extends ErrorParser<OneInchError, OneInchSwapParserDataType> {
  public static readonly errorSource = oneInchSwapSourceName;

  protected _parseError(error: OneInchError, data: OneInchSwapParserDataType): LiqualityError {
    let liqError: LiqualityError;
    let devDesc = '';

    if (error?.name !== 'NodeError') {
      // All OneInch errors must satisfy this because they are already wrapped in chainify
      liqError = new UnknownError();
    } else {
      const errorDesc = error?.description;
      switch (true) {
        case ONE_INCH_ERRORS.INSUFFICIENT_LIQUIDITY.test(errorDesc):
          liqError = new InsufficientLiquidityError({ from: data.from, to: data.to, amount: data.amount });
          break;
        case ONE_INCH_ERRORS.CANNOT_ESTIMATE_1.test(errorDesc):
          liqError = new ThirdPartyError({ activity: UserActivity.SWAP });
          devDesc = 'see https://bit.ly/3Bu3e7U';
          break;
        case ONE_INCH_ERRORS.INSUFFICIENT_GAS_FEE.test(errorDesc):
          liqError = new InsufficientGasFeeError({ currency: data.from });
          break;
        case ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS.test(errorDesc):
          liqError = new InternalError();
          break;
        case ONE_INCH_ERRORS.INVALID_TOKEN_PAIR.test(errorDesc):
          liqError = new InternalError();
          break;
        case ONE_INCH_ERRORS.CANNOT_ESTIMATE_WITH_REASON.test(errorDesc):
          liqError = new ThirdPartyError({ activity: UserActivity.SWAP });
          devDesc = 'see https://bit.ly/3Bu3e7U';
          break;
        case ONE_INCH_ERRORS.INSUFFICIENT_FUNDS.test(errorDesc):
          liqError = new InsufficientFundsError({
            currency: data.from,
            availAmt: data.balance,
            neededAmt: data.amount,
          });
          break;
        case ONE_INCH_ERRORS.INSUFFICIENT_ALLOWANCE.test(errorDesc):
          liqError = new InternalError();
          devDesc = 'Check the approval process for 1inch, approvals are not being made correctly';
          break;
        case ONE_INCH_ERRORS.INTERNAL_ERROR.test(errorDesc):
          liqError = new ThirdPartyError();
          devDesc = oneInchInternalErrReason();
          break;
        default:
          liqError = new UnknownError();
          break;
      }
    }

    liqError.source = OneInchSwapErrorParser.errorSource;
    liqError.devMsg = { desc: devDesc, data };
    liqError.rawError = error as never;

    return liqError;
  }
}

export type OneInchSwapParserDataType = {
  from: string;
  to: string;
  amount: string;
  balance: string;
};
