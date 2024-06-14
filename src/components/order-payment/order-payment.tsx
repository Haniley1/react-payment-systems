import { CloseCircleOutlined } from '@ant-design/icons';
import { IbanElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CanMakePaymentResult, PaymentRequest } from '@stripe/stripe-js';
import { Statistic, notification } from 'antd';
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AppRoutes, BillingAddress, ORDER_PAYPAL_CREATE_ORDER_URL, ORDER_TINKOFF_INIT_URL, ORDER_TINKOFF_LOAN_INIT_URL, Order, OrderCouponTypes, SEPA_CREATE_SETUP_INTENT_URL, STRIPE_CREATE_PAYMENT_INTENT_URL, STRIPE_WITH_SUB_CREATE_PAYMENT_INTENT_URL } from '~/api/model';
import { OrdersService } from '~/api/services/orders-service';
import { IPaymentSystem } from '~/api/services/payment-service';
import { getLowerNumber, getMaxNumber } from '~/api/utils/numbers';
import { classnames, declOfNum } from '~/api/utils/strings';
import '~/assets/fonts/montserrat/index.scss';
import { CareerumLoanSvg } from '~/assets/svg/logos';
import { PageLoader } from '~/shared/loader';
import OrderPaymentBilling from './components/billing';
import { ApplePayPaymentSystem, GooglePayPaymentSystem, STRIPE_DEFAULT_MODE, STRIPE_SUCCESS_PARAM, STRIPE_WITH_SUBSCRIPTION_MODE, TINKOFF_ERROR_PARAM, TINKOFF_SUCCESS_PARAM } from './constants';
import { ContactUsOnError, OrderCancelled, OrderPaidSuccessfully, OrderPayTimeExpired } from './containers';
import { IStripeCreatePaymentIntentResponse } from './hooks/useBrandPayment';
import useMetrics from './hooks/useMetrics';
import './order-payment.sass';
import { getBeautifyPrice, isOrderCancelled, isOrderPaid } from './order-payment.utils';
import SBPPaymentComponent from './sbp';
import StripePaymentComponent from './stripe/stripe-payment';
import { DebitPaymentSystems, LoanPaymentSystems, PaymentLogos, PaymentTypes } from './types';

interface OrderPaymentRootProps {
  order: Order;
  paymentSystems: IPaymentSystem[];
}

const TIME_NOW = Date.now()

function OrderPaymentRoot({ order: orderProp, paymentSystems: psProp }: OrderPaymentRootProps) {
  const { t, i18n } = useTranslation();
  const history = useHistory()
  const stripe = useStripe();
  const elements = useElements();
  useMetrics()

  const [order, setOrder] = useState<Order>(orderProp)
  const [orderBilling, setOrderBilling] = useState<BillingAddress>(order.billingAdress || { country: "" })
  const [orderPaid, setOrderPaid] = useState(false);
  const [orderCancelled, setOrderCancelled] = useState(false);
  const [orderPayTimeout, setOrderPayTimeout] = useState(false);
  const [orderTimeLimited, setOrderTimeLimited] = useState(false);
  const [contactUsOnError] = useState(false);

  // TODO: MOVE TO SEPARATE PROMOCODE COMPONENT
  const [promocode, setPromocode] = useState('');
  const [appliedPromocode, setAppliedPromocode] = useState('');
  const [isPromocodeApplied, setIsPromocodeApplied] = useState(order.offerPositions[0].couponApplied)
  const [isApplyPromocodeForInstallment, setApplyPromocodeForInstallment] = useState(order.offerPositions[0].couponTypeApplied === OrderCouponTypes.WithInstallments)
  const [appliedPromocodeTime, setAppliedPromocodeTime] = useState(0);
  const [promocodeLoading, setPromocodeLoading] = useState(false);
  const [promocodeIsInvalid, setPromocodeIsInvalid] = useState(false);
  const [promocodeError, setPromocodeError] = useState('')
  const [promocodePrice, setPromocodePrice] = useState<number | null>(isPromocodeApplied && order.price ? parseInt(order.price) : null);

  const [minTimeToPay, setMinTimeToPay] = useState(0);

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canUseBrandPayment, setCanUseBrandPayment] = useState<CanMakePaymentResult | null>(null)
  const [selectedPaymentSystem, setSelectedPaymentSystem] = useState<IPaymentSystem>();
  const [selectedLoanMonths, setSelectedLoanMonths] = useState<number>();
  const [showStripePayment, setShowStripePayment] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSepaPayment, setShowSepaPayment] = useState(false);
  const [showSBPPayment, setShowSBPPayment] = useState(false);
  const [paymentPageLoading, setPaymentPageLoading] = useState(false);

  const parsedPrice = parseInt(order.price!)
  const offer = order.offerPositions[0].offer
  const discountedPrices = offer.offerPrice_ForPaymentSystems
  const careerumLoanSelected = selectedPaymentSystem?.paymentType.title === PaymentTypes.CareerumLoan

  const PaymentTexts = useMemo((): { [key in PaymentTypes]: string } => ({
    Tinkoff: t("OrderPayment.CardPay"),
    Stripe: t("OrderPayment.CardPay"),
    StripeWithSubcription: t("OrderPayment.CardPay"),
    Sepa: t("OrderPayment.SepaPay"),
    GooglePay: t("OrderPayment.GooglePayPay"),
    ApplePay: t("OrderPayment.ApplePayPay"),
    CareerumLoan: t("OrderPayment.CareerumLoanPay"),
    TinkoffSbp: t("OrderPayment.SBPPay"),
    PayPal: t("OrderPayment.PaypalPay"),
    Braintree: "",
    TinkoffLoan: "",
  }), [t])

  const paymentSystems = useMemo(() => {
    let result = psProp
    const exceptionSystems: PaymentTypes[] = []
    const returnableSystems: PaymentTypes[] = []

    if (isPromocodeApplied) {
      exceptionSystems.push(PaymentTypes.CareerumLoan)
    }

    if (isPromocodeApplied && isApplyPromocodeForInstallment) {
      returnableSystems.push(PaymentTypes.TinkoffLoan)
    } else if (isPromocodeApplied && !isApplyPromocodeForInstallment) {
      exceptionSystems.push(PaymentTypes.TinkoffLoan)
    }

    result = result.filter(s => !exceptionSystems.includes(s.paymentType.title))

    for (let sTitle of returnableSystems) {
      const hasReturnableSystem = result.some(s => s.paymentType.title === sTitle)

      if (hasReturnableSystem) continue

      switch (sTitle) {
        case PaymentTypes.ApplePay:
          result.push(ApplePayPaymentSystem)
          break;
        case PaymentTypes.GooglePay:
          result.push(GooglePayPaymentSystem)
          break;
        default:
          const returnableSystem = psProp.find(s => s.paymentType.title === sTitle)
          if (returnableSystem) {
            result.push(returnableSystem)
          }
      }
    }

    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseBrandPayment, isApplyPromocodeForInstallment, isPromocodeApplied, psProp, appliedPromocodeTime])

  const isCurrentPsWithDiscount = useCallback((system?: IPaymentSystem) => {
    system = system ?? selectedPaymentSystem
    if (!system?.paymentType || !discountedPrices) return false

    if (system.paymentType.title === PaymentTypes.ApplePay || system.paymentType.title === PaymentTypes.GooglePay) {
      const stripeSystem = paymentSystems.find(item => item.paymentType.title === PaymentTypes.Stripe)
      return discountedPrices.some(item => item.paymentSystem === stripeSystem?.id)
    }

    return discountedPrices.some(item => item.paymentSystem === system?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountedPrices, selectedPaymentSystem])

  const getLowerPrice = useCallback((psId: number): number => {
    const prices = [parsedPrice]
    const discountItem = discountedPrices?.find(item => item.paymentSystem === psId)

    if (discountItem) prices.push(parseInt(discountItem.price))
    if (promocodePrice) prices.push(promocodePrice)

    return getLowerNumber(prices) || parsedPrice
  }, [discountedPrices, parsedPrice, promocodePrice])

  const orderPrice = useMemo((): number => {
    if (selectedPaymentSystem?.paymentType.title === PaymentTypes.TinkoffLoan) {
      const tinkoffLoanPrice = ((isPromocodeApplied && isApplyPromocodeForInstallment) && promocodePrice)
        ? promocodePrice
        : (order.offerPositions[0].priceWithoutCoupon ?? order.offerPositions[0].price)

      return tinkoffLoanPrice
    }

    if (!selectedPaymentSystem || !isCurrentPsWithDiscount(selectedPaymentSystem) || !discountedPrices) {
      return promocodePrice || parsedPrice
    }

    switch (selectedPaymentSystem.paymentType.title) {
      case PaymentTypes.ApplePay:
      case PaymentTypes.GooglePay:
        const stripeSystem = paymentSystems.find(item => item.paymentType.title === PaymentTypes.Stripe)

        if (stripeSystem) {
          return getLowerPrice(stripeSystem?.id)
        } else {
          return promocodePrice || parsedPrice
        }
      default:
        return getLowerPrice(selectedPaymentSystem.id)
    }
  }, [discountedPrices, getLowerPrice, isApplyPromocodeForInstallment, isCurrentPsWithDiscount, isPromocodeApplied, order.offerPositions, parsedPrice, paymentSystems, promocodePrice, selectedPaymentSystem])

  const paymentReturnUrl = useMemo(() => {
    if (!order?.hash) {
      return window.location.href
    }

    return `${window.location.href}?order_hash=${order.hash}`
  }, [order.hash])

  const paymentMetadata = useMemo(() => ({
    orderId: order.id,
    clientId: order?.clientId,
    payerEmail: order.Client.email,
    coupon: appliedPromocode
  }), [appliedPromocode, order])

  const tinkoffPayArgs = useMemo(() => ({
    amount: orderPrice * 100,
    orderId: order?.id,
    title: order?.title,
    email: order?.Client.email,
    clientId: order?.Client.id,
    metadata: paymentMetadata,
    language: i18n.language,
    // Return to the current url after payment
    returnUrl: paymentReturnUrl
  }), [i18n.language, order, orderPrice, paymentMetadata, paymentReturnUrl])

  const maxOldPrice = useMemo(() => {
    const arrPrices = [parsedPrice, order.offerPositions[0].price]
    if (order.offerPositions[0].priceWithoutCoupon) arrPrices.push(order.offerPositions[0].priceWithoutCoupon)

    return getMaxNumber(arrPrices)
  }, [order.offerPositions, parsedPrice])

  const OrderResultHeader = useMemo(() => {
    if (!careerumLoanSelected || !offer || !offer.innerInstallmentPaymentAmounts) {
      return (
        <div className="order-result__header" children={t("OrderPayment.TotalToPay")} />
      )
    }

    if (careerumLoanSelected) {
      const loanSum = offer.innerInstallmentPaymentAmounts.reduce((sum, current) => {
        return sum + current
      }, 0)
      const monthsAmount = offer.innerInstallmentPaymentAmounts.length
      const firstPaymentPrice = offer.innerInstallmentPaymentAmounts[0]
      const paymentTextDecl = monthsAmount + " " + declOfNum(monthsAmount, ["ежемесяный платёж", "ежемесячных платежа", "ежемесячных платежей"])

      return (
        <div className="order-result__loan">
          <div className="order-result__loan-header" children={t("OrderPayment.CareerumLoanHeader", { sum: getBeautifyPrice(firstPaymentPrice, order.currency.sign) })} />
          <div className="order-result__loan-description" children={t("OrderPayment.CareerumLoanDesc", { paymentAmount: paymentTextDecl, sum: getBeautifyPrice(loanSum, order.currency.sign) })} />
        </div>
      )
    }
  }, [careerumLoanSelected, offer, order.currency.sign, t])

  const debitSystems = useMemo(() => {
    return paymentSystems.filter(system => DebitPaymentSystems.includes(system.paymentType.title))
  }, [paymentSystems])

  const loanSystems = useMemo(() => {
    return paymentSystems.filter(system => LoanPaymentSystems.includes(system.paymentType.title))
  }, [paymentSystems])

  const onPaySuccess = () => {
    setShowStripePayment(false)
    setOrderPaid(true)
  };

  const onPayError = useCallback((err?: any, prefix: string = '') => {
    setShowStripePayment(false)
    setShowSBPPayment(false)
    setPaymentPageLoading(false)

    const title = prefix ? prefix + ": " : ""

    notification.open({
      message: <span>{`${title}${err?.message || err || t('SomethingWentWrong')}`}</span>,
      duration: 10,
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
    });
  }, [t]);

  const getStripeMode = useCallback(() => {
    if (paymentSystems.some(s => s.paymentType.title === PaymentTypes.Stripe)) {
      return STRIPE_DEFAULT_MODE
    }
    if (paymentSystems.some(s => s.paymentType.title === PaymentTypes.StripeWithSubcription)) {
      return STRIPE_WITH_SUBSCRIPTION_MODE
    }

    return STRIPE_DEFAULT_MODE
  }, [paymentSystems])

  const initPay = async () => {
    if (order.currency.code === "EUR" && !orderBilling.country) {
      onPayError(t("OrderPayment.Validation.CountryMustBeSet"))
      return
    }

    // TODO: Split to components
    try {
      switch (selectedPaymentSystem?.paymentType.title) {
        case PaymentTypes.Tinkoff: {
          setPaymentPageLoading(true)
          notification.info({ message: t("OrderPayment.LoadingPaymentPage") })

          const { data: { success, payUrl, message } } = await axios.post(ORDER_TINKOFF_INIT_URL, tinkoffPayArgs);

          if (success) {
            window.location.href = payUrl;
          } else {
            onPayError(message, 'Tinkoff');
          }

          setPaymentPageLoading(false)
          break;
        }
        case PaymentTypes.TinkoffLoan: {
          if (order && selectedLoanMonths) {
            const loanParams = {
              orderID: order.id,
              returnURL: paymentReturnUrl,
              installmentMonthCount: selectedLoanMonths
            }

            setPaymentPageLoading(true)
            notification.info({ message: t("OrderPayment.LoadingPaymentPage") })
            const loanResponse = await axios.post<{ success: boolean, payUrl: string, message: string }>(ORDER_TINKOFF_LOAN_INIT_URL, loanParams)

            if (loanResponse.data.success) {
              window.location.href = loanResponse.data.payUrl
            } else {
              onPayError(loanResponse.data.message, 'Tinkoff Loan')
            }

          }

          setPaymentPageLoading(false)
          break;
        }
        case PaymentTypes.SBP: {
          setShowSBPPayment(true)
          break;
        }
        case PaymentTypes.PayPal: {
          const paypalNotifyKey = "paypal-loading"
          notification.info({ message: t("OrderPayment.LoadingPaymentPage"), key: paypalNotifyKey })
          const paypalResponse = await axios.post<{ links: {rel: string, href: string}[] }>(ORDER_PAYPAL_CREATE_ORDER_URL, {
            orderId: order.id,
            returnUrl: paymentReturnUrl
          }).catch(err => onPayError(err));

          if (paypalResponse?.data.links) {
            const linkObject = paypalResponse.data.links.find(item => item.rel === "payer-action")

            if (linkObject) {
              window.location.href = linkObject.href
            }
          }
          notification.destroy(paypalNotifyKey)
          break;
        }
        case PaymentTypes.Stripe:
        case PaymentTypes.StripeWithSubcription: {
          setShowStripePayment(true)
          break;
        }
        case PaymentTypes.Sepa:
          setShowSepaPayment(true);
          break;
        case PaymentTypes.ApplePay:
        case PaymentTypes.GooglePay: {
          if (paymentRequest) {
            paymentRequest.show()
          }
          break;
        }
        case PaymentTypes.CareerumLoan:          
          history.push(AppRoutes.careerumLoan.replace(":hash", order.hash || order.id!.toString()))
      }
    } catch (error) {
      onPayError(error, selectedPaymentSystem?.paymentType.title)
    }
  }

  const handleStripeSubmitPay = useCallback(async () => {
    if (!stripe || !elements) return;

    notification.info({ message: t("Processing") })
    const paymentIntentUrl = getStripeMode() === STRIPE_WITH_SUBSCRIPTION_MODE ? STRIPE_WITH_SUB_CREATE_PAYMENT_INTENT_URL : STRIPE_CREATE_PAYMENT_INTENT_URL;

    const { error: elementsError } = await elements.submit();
    if (elementsError) {
      onPayError(elementsError.message)
      return
    }

    const { data: { clientSecret, success, message } } = await axios.post<IStripeCreatePaymentIntentResponse>(paymentIntentUrl, {
      amount: orderPrice * 100,
      currency: order?.currency.code,
      metadata: { ...paymentMetadata }
    }, { withCredentials: true });

    if (!success) {
      onPayError(message);
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: paymentReturnUrl },
      });

      if (error) {
        onPayError(error.message);
      } else {
        onPaySuccess();
      }
    } catch (error) {
      onPayError(error)
    }
  }, [paymentReturnUrl, elements, getStripeMode, onPayError, order?.currency.code, orderPrice, paymentMetadata, stripe, t]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSepaSubmitPay = useCallback(async (values: { name: string, email: string }) => {
    if (!stripe || !elements) return

    const iban = elements.getElement(IbanElement)
    if (!iban) return

    // TODO: Get Sepa SetupIntent
    const { data: { clientSecret, message, success } } = await axios.post<IStripeCreatePaymentIntentResponse>(SEPA_CREATE_SETUP_INTENT_URL, {
      email: order.Client.email
    }, { withCredentials: true })

    if (!success) {
      onPayError(message)
    }

    try {
      // TODO: Pass the clientSecret from SetupIntent
      const result = await stripe.confirmSepaDebitSetup(clientSecret, {
        return_url: paymentReturnUrl,
        payment_method: {
          sepa_debit: iban,
          billing_details: values
        },
      })

      if (result.error) {
        onPayError(result.error)
      } else {
        onPaySuccess()
      }
    } catch (error) {
      onPayError(error)
    }
  }, [stripe, elements, order.Client.email, onPayError, paymentReturnUrl])

  const applyPromocode = useCallback(() => {
    setPromocodeLoading(true);

    OrdersService.applyPromocode(order?.id, promocode)
      .then(({ data: { price, type } }: { data: { price: number, type: OrderCouponTypes } }) => {
        setAppliedPromocode(promocode);
        setApplyPromocodeForInstallment(type === OrderCouponTypes.WithInstallments)
        setPromocode('');
        setPromocodeLoading(false);
        setPromocodeIsInvalid(false);
        setIsPromocodeApplied(true)
        setPromocodePrice(price);
        setAppliedPromocodeTime(Date.now())

        setOrder({ ...order, price: price.toString(), toServer: order?.toServer })
      })
      .catch((error: AxiosError) => {
        let errorMessage;

        switch (error.response?.data.status) {
          case 400:
            errorMessage = t("OrderPayment.PromocodeNotFound", { promocode })
            break;
          case 500:
          default:
            errorMessage = t("OrderPayment.PromocodeDenied", { promocode })
            break;
        }

        setPromocodeError(errorMessage)
        setPromocodeIsInvalid(true);
        setPromocodeLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, promocode, t]);

  const renderDebitSystems = useCallback(() => debitSystems.map(system => {
    const logos = PaymentLogos[system.paymentType.title] || (system.iconUrl ? [system.iconUrl] : [])
    const text = PaymentTexts[system.paymentType.title] || t("OrderPayment.CardPay")

    let resultLogos = logos

    const payMethodClassname = classnames({
      "pay-method-form__input": true,
      "radio-checked": selectedPaymentSystem === system
    })

    if (system.paymentType.title === PaymentTypes.Stripe && canUseBrandPayment) {      
      if (canUseBrandPayment.applePay) {
        resultLogos = resultLogos.concat(PaymentLogos.ApplePay)
      }

      if (canUseBrandPayment.googlePay) {
        resultLogos = resultLogos.concat(PaymentLogos.GooglePay)
      }      
    }

    return (
      <div
        key={system.paymentTypeID}
        className={payMethodClassname}
        onClick={() => setSelectedPaymentSystem(system)}
      >
        <div className="pay-method-form__input__label">
          <span className="pay-method-form__text" children={text} />
          <div className="pay-method-form__logos">
            {resultLogos.map((logo, index) => <img key={index} src={logo} alt="ps" />)}
          </div>
        </div>
      </div>
    )
  }), [PaymentTexts, canUseBrandPayment, debitSystems, selectedPaymentSystem, t])

  const renderLoanSystems = useCallback(() => loanSystems.map(system => {
    const text = PaymentTexts[system.paymentType.title] || t("OrderPayment.CardPay")

    if (system.paymentType.title === PaymentTypes.TinkoffLoan && system.months) {
      return system.months.map(month => {
        const key = `${system.paymentTypeID}_${month}`
        const isLoanChecked = `${selectedPaymentSystem?.paymentTypeID}_${selectedLoanMonths}` === key
        const price = (isPromocodeApplied && isApplyPromocodeForInstallment) ? orderPrice : order.offerPositions[0].price
        const payMethodClassname = classnames({
          "pay-method-form__input": true,
          "radio-checked": isLoanChecked,
        })

        return (
          <div
            key={key}
            className={payMethodClassname}
            onClick={() => {
              setSelectedPaymentSystem(system)
              setSelectedLoanMonths(month)
            }}
          >
            <div className="pay-method-form__tinkoff-loan">
              <div className="pay-method-form__tinkoff-loan__text">
                <span className='pay-method-form__text' children={`Рассрочка ${month} ${declOfNum(month, ["месяц", "месяца", "месяцев"])}`} />
                <span className='pay-method-form__tinkoff-loan__payment' children={`${getBeautifyPrice(Math.round(price / month), order.currency.sign)} / мес.`} />
              </div>
              <div className="pay-method-form__tinkoff-loan__logo" />
            </div>
          </div>
        )
      })
    }

    if (system.paymentType.title === PaymentTypes.CareerumLoan) {
      const payMethodClassname = classnames({
        "pay-method-form__input": true,
        "radio-checked": selectedPaymentSystem === system,
      })

      return (
        <div
          key={system.paymentTypeID}
          className={payMethodClassname}
          onClick={() => setSelectedPaymentSystem(system)}
        >
          <div className="pay-method-form__input__label">
            <span className="pay-method-form__text" children={text} />
            <div>
              <img className="no-border" src={CareerumLoanSvg} alt="ps" />
            </div>
          </div>
        </div>
      )
    }

    return <></>
  }), [PaymentTexts, isApplyPromocodeForInstallment, isPromocodeApplied, loanSystems, order.currency.sign, order.offerPositions, orderPrice, selectedLoanMonths, selectedPaymentSystem, t])

  useEffect(() => {
    setOrderPaid(isOrderPaid(order));
    setOrderCancelled(isOrderCancelled(order));

    // Get minimum offer time
    const arrayOfTimes = order?.offerPositions.map(({ offer }) => offer.checkoutTermInMinutes).filter(time => !!time) as number[];
    const minTime = arrayOfTimes ? Math.min(...arrayOfTimes) : 0;

    if (arrayOfTimes?.length && minTime) {
      const orderCreatedAt = +new Date(order?.createdAt || '');
      const timeLeft = Date.now() - (orderCreatedAt + minTime * 60000);

      if (timeLeft >= 0) {
        setOrderPayTimeout(true);
      }
      else {
        setMinTimeToPay(timeLeft);
        setOrderTimeLimited(true)
      }
    } else {
      setOrderTimeLimited(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  useEffect(() => {
    if (paymentSystems.length === 0) return

    const firstPaymentSystem = debitSystems.length ? debitSystems[0] : paymentSystems[0]
    setSelectedPaymentSystem(firstPaymentSystem)

    if (firstPaymentSystem.paymentType.title === PaymentTypes.TinkoffLoan && firstPaymentSystem.months?.length) {
      setSelectedLoanMonths(firstPaymentSystem.months[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update Stripe instances on price update
  useEffect(() => {
    const price = parseFloat((orderPrice * 100).toFixed(2))

    if (elements && orderPrice !== 0 && order.currency) {
      elements.update({
        amount: price,
        currency: order.currency.code.toLocaleLowerCase()
      })
    }

    if (paymentRequest) {
      paymentRequest.update({ total: { label: order?.title || '', amount: price } });
      setPaymentRequest(paymentRequest);
    }
  }, [elements, order, orderPrice, paymentRequest])

  useEffect(() => {    
    if (!stripe || order.currency.code === "RUB") return

    const paymentRequest = stripe.paymentRequest({
      country: 'US', //TODO: Read this value from user's setting or use default option 'US'
      currency: order?.currency.code.toLowerCase() || 'eur',
      total: {
        label: order?.title || '',
        amount: orderPrice * 100,
      },
      requestPayerEmail: false,
    });

    paymentRequest.canMakePayment()
      .then(result => setCanUseBrandPayment(result))

    setPaymentRequest(paymentRequest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, stripe])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tinkoffError = urlParams.get(TINKOFF_ERROR_PARAM);
    const tinkoffSuccess = urlParams.get(TINKOFF_SUCCESS_PARAM);
    const stripeSuccess = urlParams.get(STRIPE_SUCCESS_PARAM) === "succeeded"

    if (tinkoffError) {
      onPayError(t('PaymentProccessError'), 'Tinkoff');
    }

    if (tinkoffSuccess || stripeSuccess) {
      onPaySuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (orderPaid) {
    return <OrderPaidSuccessfully order={order} />
  }

  if (contactUsOnError) {
    return <ContactUsOnError />
  }

  if (orderPayTimeout) {
    return <OrderPayTimeExpired orderId={order?.id} />
  }

  if (orderCancelled) {
    return <OrderCancelled />
  }

  return (
    <div className="order-payment-component" id="payment-blocks-root">
      {paymentPageLoading && <PageLoader />}
      <StripePaymentComponent
        billing={orderBilling}
        client={order.Client}
        show={showStripePayment}
        email={order.Client.email}
        buttonText={t("Pay") + ` ${orderPrice}${order.currency.sign}`}
        buttonClass='button-submit'
        onClose={() => setShowStripePayment(false)}
        onSubmitPay={handleStripeSubmitPay}
      />
      <SBPPaymentComponent
        show={showSBPPayment}
        orderId={order.id!}
        tinkoffArgs={tinkoffPayArgs}
        onClose={() => setShowSBPPayment(false)}
        onPaySuccess={onPaySuccess}
      />
      {/* <Drawer
        visible={showSepaPayment}
        title={t('OrderPayment.Label')}
        width="100vw"
        destroyOnClose
        onClose={() => setShowSepaPayment(false)}
      >
        <SepaForm
          defaultValues={{ accountholder: order.Client.fullName, email: order.Client.email }}
          buttonText={`${t("Pay")} ${getBeautifyPrice(orderPrice, order.currency.sign)}`}
          onSubmit={handleSepaSubmitPay}
        />
      </Drawer> */}
      <div className="careerum-pay">
        <div className="container">
          <div className="page-header-text" children={t("OrderPayment.Title")} />
          <div className="container-2col">
            <div className="col-left">
              <div className="order-info">
                <div className="order-header">
                  <div className="page-subheader-text" children={t("OrderPayment.OrderContent")} />
                  {order?.offerPositions.map(item => (
                    <div className="order-header__text" key={item.id} children={item.offer.title} />
                  ))}
                </div>
                <div className="order-customer">
                  <div className="page-subheader-text" children={t("OrderPayment.BuyerDetails")} />
                  <div className="order-customer__name" children={order.Client.fullName} />
                  <div className="order-customer__data">
                    <div className="order-customer__email" children={order.Client.email} />
                    <div className="order-customer__tel" children={order.Client.phone} />
                  </div>
                </div>
              </div>
              {order.currency.code === "EUR" && (
                <OrderPaymentBilling
                  order={order}
                  values={order.billingAdress}
                  onChange={(values) => setOrderBilling(values)}
                />
              )}
              <div className="order-description hide-mobile">
                {t("OrderPayment.OrderDescription")}
                <a href="mailto:hello@careerum.com">hello@careerum.com</a>
              </div>
              <div className="help-text hide-tablet hide-mobile">
                {t("OrderPayment.Help")}
                <a href="mailto:hello@careerum.com">hello@careerum.com</a>
              </div>
            </div>
            <div className="col-right">
              <div className="order-wrapper">
                <div className="order-result">
                  {OrderResultHeader}
                  {!careerumLoanSelected && (
                    <div className="order-result__total">
                      <div className="order-result__amount" children={getBeautifyPrice(orderPrice, order.currency.sign)} />
                      {(maxOldPrice && orderPrice < maxOldPrice) && (
                        <div className="order-result__old" children={getBeautifyPrice(maxOldPrice, order.currency.sign)} />
                      )}
                      {isPromocodeApplied && (
                        <div className="order-result__promo-notification" children={t("OrderPayment.PromocodeAccepted", { promocode: appliedPromocode })} />
                      )}
                    </div>
                  )}
                  <div className="order-result__promo">
                    <div className="promo-form">
                      <div className="form-field">
                        <input
                          type="text"
                          className={classnames({ "form-field__input": true, "error": promocodeIsInvalid })}
                          name="promocode"
                          placeholder={t("Promocode")}
                          disabled={careerumLoanSelected}
                          value={promocode}
                          onChange={evt => setPromocode(evt.target.value)}
                        />
                      </div>
                      <div className="order-result__promo__submit">
                        <button
                          className="button-submit"
                          children={t("Apply")}
                          disabled={promocode.length === 0 || promocodeLoading || careerumLoanSelected}
                          onClick={applyPromocode}
                        />
                      </div>
                      {promocodeIsInvalid && (
                        <div className="form-alert" children={promocodeError} />
                      )}
                      {careerumLoanSelected && (
                        <div className="form-alert" children={t("OrderPayment.Validation.PromocodeDenied")} />
                      )}
                    </div>
                  </div>
                </div>
                {!!debitSystems.length && (
                  <div className="order-method full-pay">
                    <div className="order-method__text" children={t("OrderPayment.FullPay")} />
                    <div className="pay-method-form" children={renderDebitSystems()} />
                  </div>
                )}
                {!!loanSystems.length && (
                  <div className="order-method part-pay">
                    <div className="order-method__text" children={t("OrderPayment.PartPay")} />
                    <div className="pay-method-form" children={renderLoanSystems()} />
                  </div>
                )}
                <div className="pay-method-form__submit">
                  <button
                    className="button-submit"
                    disabled={!selectedPaymentSystem || paymentPageLoading || promocodeLoading}
                    children={t("Pay")}
                    onClick={initPay}
                  />
                </div>
                {orderTimeLimited && (
                  <div className="order-timer">
                    <div className="order-timer__description" children={t("OrderPayment.TimerDescription")} />
                    <div className="order-timer__counter">
                      <Statistic.Countdown
                        className="order-timer__counter__elem"
                        value={TIME_NOW + (minTimeToPay * -1)}
                        onFinish={() => setOrderPayTimeout(true)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="order-description hide-desktop hide-tablet">
                {t("OrderPayment.OrderDescription")}
                <a href="mailto:hello@careerum.com">hello@careerum.com</a>
              </div>
              <div className="help-text hide-desktop">
                {t("OrderPayment.Help")}
                <a href="mailto:hello@careerum.com">hello@careerum.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(OrderPaymentRoot);
