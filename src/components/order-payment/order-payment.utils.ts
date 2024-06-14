import { Order } from "~/api/model";

export const StripeAuthRequiredMessage = 'authentication_required';

export enum ResultQuery {
  Success = 'success',
  Fail = 'fail'
}

export const isOrderPaid = (order: Order): boolean => {
  const orderStatus = order.orderStatus.title;

  return orderStatus === "PAID" || orderStatus === "COMPLETED";
};

export const isLoanOrderPaid = (order: Order): boolean => {
  const orderStatus = order.orderStatus.title;
  const loanEnabled = !!order.offerPositions[0].offer.innerInstallmentEnabled
  const searchParams = new URLSearchParams(window.location.search)
  const hasHash = searchParams.has("order_hash") && searchParams.get("order_hash") === order.hash

  return orderStatus === "PAID" || orderStatus === "COMPLETED" || orderStatus === "PARTLY_PAID" || (loanEnabled && hasHash);
};

export const isOrderCancelled = (order: Order): boolean => {
  const orderStatus = order.orderStatus.title;

  return orderStatus === "CANCELLED";
};

export const getBeautifyPrice = (price?: number | string, sign?: string, locale = "ru-RU"): string => {
  if (!price) return ""

  const separatedPrice = typeof price === "number"
    ? price.toLocaleString(locale)
    : parseFloat(price).toLocaleString(locale);

  return `${separatedPrice} ${sign}`
}

export const isHash = (value: string): boolean => {
  const numericRegex = /^[0-9]+$/;
  return !numericRegex.test(value);
}
