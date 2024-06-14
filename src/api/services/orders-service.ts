import axios, { AxiosResponse } from 'axios';
import { CHECKOUT_ORDER_URL, getApplyOrderPromocodeUrl, getOneOrderHash, getOrderExpirationUrl, getOrderSetBilling, getSendInnerInstallmentPayments } from '../model';
import { BillingAddress, InnerInstallmentOrder, Order } from '../model/orders';
import { EntityService } from './service-factory';

const applyPromocode = (orderId: number, promocode: string): Promise<AxiosResponse<any>> => {
  return axios.get(getApplyOrderPromocodeUrl(orderId, promocode), {
      withCredentials: true,
  });
}

const setOrderExpired = (orderId: number): Promise<AxiosResponse<any>> => {
  return axios.put(getOrderExpirationUrl(orderId), {
      withCredentials: true,
  });
}

const setBillingAddress = (orderId: number, billing: BillingAddress) => {
  return axios.post(getOrderSetBilling(orderId), billing, { withCredentials: true })
}

const checkoutOrder = (orderHash: string) => {
  return axios.get(CHECKOUT_ORDER_URL, { params: { orderHash }, withCredentials: true })
}

const sendInnerInstallmentPayments = (orderId: number, payments: Omit<InnerInstallmentOrder, "id">) => {
  return axios.post(getSendInnerInstallmentPayments(orderId), payments, { withCredentials: true })
}

const getOneHash = (hash: string) => {
  return axios.get(getOneOrderHash(hash), { withCredentials: true })
}

const getOne = (id: string) => {
  return axios.get(getOneOrderHash(id), { withCredentials: true })
}

export const OrdersService = EntityService.createService<Order>('orders',  { applyPromocode, setOrderExpired, setBillingAddress, checkoutOrder, sendInnerInstallmentPayments, getOneHash, getOne });
