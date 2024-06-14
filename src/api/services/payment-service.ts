import axios, { AxiosResponse } from 'axios';
import { ALL_CURRENCY_URL, ALL_PAYMENT_SYSTEMS_URL, ALL_PAYMENT_TOKENS_URL, Currency, DELETE_PAYMENT_TOKEN_URL, ID, IGetArrayAxiosResponse } from '~/api/model';
import { PaymentTypes } from '~/components/order-payment/types';

export interface IPaymentType {
  id: number;
  title: PaymentTypes;
}

export interface IPaymentSystem {
  id: number;
  paymentTypeID: number;
  paymentType: IPaymentType;
  iconUrl: string;
  isCard: boolean;
  isActive: boolean;
  months?: number[]
}

export interface IGetPaymentSystems {
  orderID?: number;
  location?: string | null;
}

export interface IPaymentToken {
  cardBrand: string;
  cardExpires: string;
  cardLast4: number;
  id: number;
  paymentCustomer: string;
  paymentSystemID: number;
  token: string;
  userID: number;
  paymentSystem: IPaymentSystem;
}

export class PaymentService {
  private static readonly allCurrenciesUrl = ALL_CURRENCY_URL;

  public static getAllCurrencies(): Promise<AxiosResponse<IGetArrayAxiosResponse<Currency>>> {
    return axios.get(this.allCurrenciesUrl, {
      withCredentials: true,
    });
  }

  public static getPaymentSystems(getParams: IGetPaymentSystems): Promise<AxiosResponse<IGetArrayAxiosResponse<any>>> {
    const params: any = {};
    if (getParams.orderID) {
      params["orderID"] = getParams.orderID;
    }
    if (getParams.location) {
      params["location"] = getParams.location;
    }
    return axios.get(ALL_PAYMENT_SYSTEMS_URL, {
      withCredentials: true,
      params
    });
  }

  public static getPaymentTokens(): Promise<AxiosResponse<IGetArrayAxiosResponse<any>>> {
    return axios.get(ALL_PAYMENT_TOKENS_URL, {
      withCredentials: true,
    });
  }

  public static deletePaymentTokens(ids: ID[]): Promise<AxiosResponse<boolean>> {
    return axios.get(`${DELETE_PAYMENT_TOKEN_URL}`, {
      withCredentials: true,
      params: {id: ids.join()}
    });
  }
}