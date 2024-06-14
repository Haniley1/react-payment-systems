// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { deserialize, JsonArray, JsonName, serialize } from 'tserialize';
import { Client } from '.';
import { ID } from './generics';

export type OrderKey = keyof Omit<Order, 'toServer'>;

export const isOrderKey = (value?: unknown): value is OrderKey => Order.keys.includes(value as any);

export class OfferPosition {
  @JsonName() id!: number;
  @JsonName() orderID!: number;
  @JsonName() offerID!: number;
  @JsonName() quantity!: number;
  @JsonName() price!: number;
  @JsonName() currencyID!: number;
  @JsonName() couponApplied!: boolean;
  @JsonName() couponTypeApplied!: OrderCouponTypes;
  @JsonName() offer!: Offer;
  @JsonName() priceWithoutCoupon!: number | null;
}

export class InnerInstallmentOrder {
  constructor(
    public id: number,
    public index: number,
    public date: string,
    public price: number,
    public orderID: number,
    public currencyID: number,
    public paymentID: number | null,
    public paymentIntentClientSecret?: string,
    public invoiceURL?: string
  )
  {}
}

export class Order {
  @JsonName() readonly id?: ID;
  @JsonName() readonly title!: string;
  @JsonName() readonly closed!: boolean;
  @JsonName() readonly price?: string;
  @JsonName() readonly hash?: string;
  @JsonName() readonly orderStatusID = 1;
  @JsonName() readonly utm_source?: string;
  @JsonName() readonly utm_medium?: string;
  @JsonName() readonly utm_content?: string;
  @JsonName() readonly utm_campaign?: string;
  @JsonName() readonly utm_term?: string;
  @JsonName() readonly utm_group?: string;
  @JsonName() readonly createdAt!: string;
  @JsonName() readonly updatedAt?: string;
  @JsonName() readonly closedAt?: string;
  @JsonName() readonly clientId?: number;
  @JsonName() readonly managerId?: number;
  @JsonName() readonly paymentTypeID?: number;
  @JsonName() readonly isSubscription?: boolean;
  @JsonName() readonly paidTotal?: number;
  @JsonName() readonly orderStatus!: OrderStatus;
  @JsonName() readonly currency!: Currency;
  @JsonName() readonly Client!: Client;
  @JsonName() readonly paymentType!: PaymentType;
  @JsonName() readonly billingAdress?: BillingAddress;
  @JsonName() readonly payByInnerInstallment?: boolean;
  @JsonArray(InnerInstallmentOrder, 'orderPaymentsForInnerInstallment') readonly orderPaymentsForInnerInstallment?: InnerInstallmentOrder[];
  @JsonArray(OfferPosition, 'offerPositions') readonly offerPositions!: OfferPosition[];

  static from(data: Partial<Order>): Order {
    return Object.assign(new Order(), data);
  }

  // public static from(data: Partial<IOrderFields>) {
  //   return Object.assign(new OrderDto('', 1), data);
  // }

  static fromServer(data: object): Order {
    return deserialize(data, Order);
  }

  toServer(): object {
    // const dto = extract('title', 'price', 'closed', 'clientId', 'managerId',
    //   'orderStatusID', 'utmSource', 'utm_medium', 'utm_content', 'utm_campaign',
    //   'utm_term', 'userId', 'productId', 'offerPositions');
    const data = serialize(this);

    // TODO: @flamenkito enable decorators
    return Object.assign(data, {offerPositions: this.offerPositions});
  }

  static readonly keys: OrderKey[] = ['id', 'paidTotal', 'price', 'createdAt', 'updatedAt', 'closedAt', 'title', 'closed',
    'hash', 'orderStatusID', 'utm_source', 'utm_medium', 'utm_content', 'utm_campaign', 'utm_term','utm_group', 'clientId', 'managerId', 'offerPositions'];
}

// export interface IOrderFields {
//   [OrderDataIndex.ID]: ID;
//   [OrderDataIndex.CreatedAt]: Date;
//   [OrderDataIndex.UpdatedAt]: Date;
//   [OrderDataIndex.ClosedAt]: Date;
//   [OrderDataIndex.Title]: string;
//   [OrderDataIndex.Price]: string;
//   [OrderDataIndex.Closed]: boolean;
//   [OrderDataIndex.OrderStatusID]: number;
//   [OrderDataIndex.UtmSource]: string;
//   [OrderDataIndex.UtmMedium]: string;
//   [OrderDataIndex.UtmContent]: string;
//   [OrderDataIndex.UtmCampaign]: string;
//   [OrderDataIndex.UtmTerm]: string;
//   [OrderDataIndex.UserID]: string;
//   [OrderDataIndex.ProductID]: string;
// }

export class OrderStatus {
  constructor(
    public id: number,
    public title: string,
    public isCustom: boolean
  ) {}
}

export class Currency {
  constructor(
    public id: number,
    public code: string,
    public sign: string
  ) {
  }
}

export class PaymentType {
  constructor(
    public id: number,
    public title: string,
  ) {}
}

export interface BillingAddress {
  country: string
  zip?: string
  city?: string
  address?: string
}

export enum ProductAccessTypes {
  NoLimits = 1,
  Subscription = 2
}

export enum OrderCouponTypes {
  FullPay = "FULL_AMOUNT",
  WithInstallments = "FULL_AMOUNT_AND_INSTALLMENTS",
}

export class ProductAccessType {

  constructor(
    public productID: number,
    public productAccessType: ProductAccessTypes,
    public subscriptionDaysCount?: number,
    public offerID?: number,
  ) {
  }
}

export class Offer {

  constructor(
    public id: number,
    public title: string,
    public description: string,
    public displayName: string,
    public price: number,
    public currencyID: number,
    public productAccessTypes: ProductAccessType[],
    public autoCompleteOnPaid: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public innerInstallmentEnabled?: boolean,
    public innerInstallmentPaymentAmounts?: Array<number>,
    public callbackUrl?: string,
    public getcourseOfferCode?: string,
    public redirectURLAfterPayment?: string,
    public checkoutTermInMinutes?: number,
    public offerPrice_ForPaymentSystems?: PaymentSystemPrice[],
    public setPasswordAfterPayment?: boolean
  ) {
  }
}

export interface PaymentSystemPrice {
  offerID?: number
  paymentSystemID?: number
  // Take this field in case getting Offer from Order
  paymentSystem?: number
  price: string
}

export enum OfferDataIndex {
  ID = 'id',
  Title = 'title',
  Description = 'description',
  DisplayName = 'displayName',
  Price = 'price',
  AutoCompleteOnPaid = 'autoCompleteOnPaid',
  CurrencyID = 'currencyID',
  ProductAccessTypes = 'productAccessTypes',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  GetcourseOfferCode = 'getcourseOfferCode',
  RedirectURLAfterPayment = 'redirectURLAfterPayment',
  CheckoutTermInMinutes = 'checkoutTermInMinutes',
  innerInstallmentEnabled = 'innerInstallmentEnabled',
  innerInstallmentPaymentAmounts = 'innerInstallmentPaymentAmounts',
  offerPrice_ForPaymentSystems = 'offerPrice_ForPaymentSystems',
  setPasswordAfterPayment = 'setPasswordAfterPayment',
  callbackUrl = 'callbackUrl'
}

export interface IOfferFields {
  [OfferDataIndex.ID]: number,
  [OfferDataIndex.Title]: string,
  [OfferDataIndex.Description]: string,
  [OfferDataIndex.DisplayName]: string,
  [OfferDataIndex.Price]: number,
  [OfferDataIndex.AutoCompleteOnPaid]: boolean,
  [OfferDataIndex.CurrencyID]: number,
  [OfferDataIndex.ProductAccessTypes]: ProductAccessType[],
  [OfferDataIndex.CreatedAt]: Date,
  [OfferDataIndex.UpdatedAt]: Date,
  [OfferDataIndex.GetcourseOfferCode]: string,
  [OfferDataIndex.RedirectURLAfterPayment]: string,
  [OfferDataIndex.CheckoutTermInMinutes]: number,
  [OfferDataIndex.innerInstallmentEnabled]: boolean,
  [OfferDataIndex.innerInstallmentPaymentAmounts]: number[],
  [OfferDataIndex.offerPrice_ForPaymentSystems]: PaymentSystemPrice[],
  [OfferDataIndex.setPasswordAfterPayment]: boolean,
  [OfferDataIndex.callbackUrl]: string
}

export const blankOffer = new Offer(
  -1,
  '',
  '',
  '',
  0,
  -1,
  [],
  true,
  new Date(),
  new Date(),
  false,
);
