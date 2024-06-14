import { IPaymentSystem } from "~/api/services/payment-service";

export const STRIPE_WITH_SUBSCRIPTION_MODE = 'with-subscription';
export const STRIPE_DEFAULT_MODE = 'default';
export const TINKOFF_SUCCESS_PARAM = 'tinkoff_success';
export const TINKOFF_ERROR_PARAM = 'tinkoff_fail';
export const STRIPE_SUCCESS_PARAM = 'redirect_status';

export const CareerumPaymentSystem: IPaymentSystem = {
  id: -10,
  iconUrl: "",
  isActive: true,
  isCard: true,
  paymentTypeID: -10,
  paymentType: {
    id: -10,
    // @ts-ignore
    title: "CareerumLoan"
  }
}

export const GooglePayPaymentSystem: IPaymentSystem = {
  id: -11,
  isActive: true,
  isCard: true,
  paymentTypeID: -11,
  paymentType: {
    id: -11,
    // @ts-ignore
    title: "GooglePay"
  },
  iconUrl: ""
}

export const ApplePayPaymentSystem: IPaymentSystem = {
  id: -12,
  isActive: true,
  isCard: true,
  paymentTypeID: -12,
  paymentType: {
    id: -12,
    // @ts-ignore
    title: "ApplePay"
  },
  iconUrl: ""
}
