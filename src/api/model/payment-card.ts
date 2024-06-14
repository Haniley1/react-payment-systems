import { ID } from './generics';

export interface IPaymentCard {
  id: ID;
  token: string;
  paymentCustomer: string;
  cardBrand: TCardBrands | null;
  cardLast4?: string;
  cardFirst6?: string;
  cardExpires: string;
  userID: number;
  paymentSystemID: number;
  isDefault: boolean;
}

export type TCardBrands = 'mastercard' | 'maestro' | 'visa' | 'mir'
export interface ICardDesign {
  backgroundColor?: string;
  backgroundGradient?: string[];
  backgroundLightness?: boolean;
  cobrand?: string;
  country?: string;
  defaultLanguage?: string;
  logo?: string;
  logoInvert?: string;
  logoMini?: string;
  name?: string;
  nameEn?: string;
  paymentSystem?: TCardBrands | null;
  status?: 'SUCCESS' | 'FAIL';
  supportedInvertTheme?: boolean;
  textColor?: string;
  url?: string;
}
