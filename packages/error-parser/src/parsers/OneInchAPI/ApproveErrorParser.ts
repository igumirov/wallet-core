/* eslint-disable @typescript-eslint/no-explicit-any */
import { LiqualityError } from '../../LiqualityErrors';
import { ErrorParser } from '../ErrorParser';
import ThirdPartyError from '../../LiqualityErrors/ThirdPartyError';
import InternalError from '../../LiqualityErrors/InternalError';
import UnknownError from '../../LiqualityErrors/UnknownError';
import { oneInchInternalErrReason, OneInchError, ONE_INCH_ERRORS } from '.';

// eslint-disable-next-line @typescript-eslint/ban-types
export class OneInchApproveErrorParser extends ErrorParser<OneInchError, null> {
  protected _parseError(error: OneInchError): LiqualityError {
    let liqError: LiqualityError;
    let devDesc = '';

    if (error?.name !== 'NodeError') {
      // All OneInch errors must satisfy this because they are already wrapped in chainify
      liqError = new UnknownError();
    } else {
      const errorDesc = error?.description;
      switch (true) {
        case ONE_INCH_ERRORS.INTERNAL_ERROR.test(errorDesc):
          liqError = new ThirdPartyError();
          devDesc = oneInchInternalErrReason();
          break;
        case ONE_INCH_ERRORS.INVALID_TOKEN_ADDRESS.test(errorDesc):
          liqError = new InternalError();
          break;
        default:
          liqError = new UnknownError();
          break;
      }
    }

    liqError.source = this.errorSource;
    liqError.devMsg = { desc: devDesc, data: null };
    liqError.rawError = error as never;

    return liqError;
  }
}

OneInchApproveErrorParser.prototype.errorSource = 'OneInchApproveAPI';
