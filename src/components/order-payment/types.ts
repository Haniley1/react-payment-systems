import { ApplePaySvg, CareerumLoanSvg, GooglePaySvg, MastercardSvg, MirSvg, PaypalSvg, SBPSvg, SepaSvg, TinkoffLoanSvg, VisaSvg } from '~/assets/svg/logos';

export enum PaymentTypes {
  Stripe = 'Stripe',
  StripeWithSubcription = 'StripeWithSubcription',
  Braintree = 'Braintree',
  PayPal = 'PayPal',
  Tinkoff = 'Tinkoff',
  Sepa = 'Sepa',
  TinkoffLoan = 'TinkoffLoan',
  CareerumLoan = 'CareerumLoan',
  ApplePay = 'ApplePay',
  GooglePay = 'GooglePay',
  SBP = 'TinkoffSbp'
}

export const PaymentLogos: { [key in PaymentTypes]: Array<string> } = {
  Tinkoff: [MirSvg, VisaSvg, MastercardSvg],
  Stripe: [VisaSvg, MastercardSvg],
  StripeWithSubcription: [VisaSvg, MastercardSvg],
  ApplePay: [ApplePaySvg],
  GooglePay: [GooglePaySvg],
  PayPal: [PaypalSvg],
  Braintree: [],
  Sepa: [SepaSvg],
  TinkoffLoan: [TinkoffLoanSvg],
  CareerumLoan: [CareerumLoanSvg],
  TinkoffSbp: [SBPSvg],
}

export const DebitPaymentSystems: Array<PaymentTypes> = [
  PaymentTypes.Tinkoff,
  PaymentTypes.Stripe,
  PaymentTypes.StripeWithSubcription,
  PaymentTypes.Sepa,
  PaymentTypes.ApplePay,
  PaymentTypes.GooglePay,
  PaymentTypes.SBP,
  PaymentTypes.PayPal
]

export const LoanPaymentSystems: Array<PaymentTypes> = [
  PaymentTypes.CareerumLoan,
  PaymentTypes.TinkoffLoan
]
