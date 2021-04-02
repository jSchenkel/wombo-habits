
import { PLATFORM_FEE_PERCENTAGE, CHARGE_FEE_PERCENTAGE } from '../constants/payments.js';

// takes fee in cents and calculates platform fee (PLATFORM_FEE_PERCENTAGE)
export const calculatePlatformFee = (feeInCents) => {
  // TODO: change payment flow to take this from the creator on the backend. Dont pass on to customer.
  // I.e. price set by the creator is what the consumer pays. we pull our take on the backend of the transaction

  // return (feeInCents * PLATFORM_FEE_PERCENTAGE) + (feeInCents * CHARGE_FEE_PERCENTAGE) + 30;
  return feeInCents * PLATFORM_FEE_PERCENTAGE;
}

// return the total fee (fee + stripe fee + platform fee)
export const getTotalFee = (feeInCents) => {
  return feeInCents + calculatePlatformFee(feeInCents);
}

export const convertDollarsToCents = (feeInDollars) => {
  return feeInDollars * 100;
}

export const convertCentsToDollars = (feeInCents) => {
  return feeInCents / 100;
}

export const makeDollarFeeDisplayable = (feeInDollars) => {
  let final = feeInDollars;
  // if the dollar value is a decimal (has cents) then fix to 2 decimal places
  if (final % 1 !== 0) {
    final = final.toFixed(2)
  }
  return final;
}
