import { useElements, useStripe } from "@stripe/react-stripe-js";
import { notification } from "antd";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { InnerInstallmentOrder, Order, STRIPE_CREATE_PAYMENT_INTENT_URL } from "~/api/model";
import { IStripeCreatePaymentIntentResponse } from "../hooks/useBrandPayment";
import '../order-payment.sass';
import StripePaymentComponent from "../stripe/stripe-payment";

interface OrderPaymentLoanProps {
  order: Order
  currentPayment: InnerInstallmentOrder
  payedAmount: number
  onPaySuccess?: () => void
  onPayError?: (err: any, prefix?: string) => void
}

export default function OrderPaymentLoan({ order, currentPayment, payedAmount, onPaySuccess = () => {}, onPayError = () => {} }: OrderPaymentLoanProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useTranslation()

  const [showStripePayment, setShowStripePayment] = useState(false)

  const PaymentCount = useMemo(() => {
    if (!currentPayment) return

    const paymentsCount = order.orderPaymentsForInnerInstallment?.length

    return `${payedAmount} из ${paymentsCount} платежей`
  }, [currentPayment, order.orderPaymentsForInnerInstallment?.length, payedAmount])

  const paymentReturnUrl = useMemo(() => {
    if (!order?.hash) {
      return window.location.href
    }

    return `${window.location.href}?order_hash=${order.hash}`
  }, [order.hash])

  const initPay = () => {
    if (order.currency.code === "EUR") {
      setShowStripePayment(true)
    } else if (order.currency.code === "RUB" && currentPayment.invoiceURL) {
      window.location.replace(currentPayment.invoiceURL)
    }
  }

  const handleStripeSubmitPay = useCallback(async () => {
    if (!stripe || !elements) return;

    const notifyKey = "loan-process"
    notification.info({ key: notifyKey, message: t("Processing"), duration: 0 })

    const { error: elementsError } = await elements.submit();
    if (elementsError) {
      onPayError(elementsError.message)
      notification.destroy(notifyKey)
      return
    }

    let clientSecret: string

    if (currentPayment.paymentIntentClientSecret) {
      clientSecret = currentPayment.paymentIntentClientSecret
    } else {
      const { data: { clientSecret: newClientSecret, success, message } } = await axios.post<IStripeCreatePaymentIntentResponse>(STRIPE_CREATE_PAYMENT_INTENT_URL, {
        amount: currentPayment.price * 100,
        currency: order?.currency.code,
        metadata: {
          orderId: `${order.id}/${currentPayment.index}ii`,
          clientId: order?.clientId,
          payerEmail: order.Client.email,
          innerInstallmentPaymentID: currentPayment.id
        }
      }, { withCredentials: true });
  
      if (!success) {
        onPayError(message);
        notification.destroy(notifyKey)
        return;
      }

      clientSecret = newClientSecret
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: paymentReturnUrl },
        redirect: "if_required"
      });

      notification.destroy(notifyKey)

      if (error) {
        onPayError(error.message);
      } else {
        onPaySuccess();
      }
    } catch (error) {
      onPayError(error)
    }
  }, [currentPayment.id, currentPayment.index, currentPayment.paymentIntentClientSecret, currentPayment.price, elements, onPayError, onPaySuccess, order.Client.email, order?.clientId, order?.currency.code, order.id, paymentReturnUrl, stripe, t]);

  useEffect(() => {
    const price = parseFloat((currentPayment.price * 100).toFixed(2))

    if (elements && currentPayment.price !== 0 && order.currency) {
      elements.update({
        amount: price,
        currency: order.currency.code.toLocaleLowerCase()
      })
    }
  }, [currentPayment.price, elements, order.currency])

  if (!currentPayment) return <></>

  return (
    <div className="order-loan-payment-component" id="payment-blocks-root">
      <StripePaymentComponent
        show={showStripePayment}
        email={order.Client.email}
        buttonText={t("Pay") + ` ${currentPayment.price}${order.currency.sign}`}
        buttonClass='button-submit'
        onClose={() => setShowStripePayment(false)}
        onSubmitPay={handleStripeSubmitPay}
      />
      <div className="careerum-pay">
        <div className="container">
          <div className="page-header-text" children={t("OrderPayment.Title")} />
          <div className="container-2col">
            <div className="order-info">
              <div className="order-header">
                <div className="page-subheader-text" children={t("OrderPayment.OrderContent")} />
                {order?.offerPositions.map(item => (
                  <div className="order-header__text" key={item.id} children={item.offer.title} />
                ))}
                {currentPayment && (
                  <div className="order-header__text" children={PaymentCount} />
                )}
              </div>
              <div className="order-customer">
                <div className="page-subheader-text" children={t("OrderPayment.BuyerDetails")} />
                <div className="order-customer__name" children={order.Client.fullName} />
                <div className="order-customer__data">
                  <div className="order-customer__email" children={order.Client.email} />
                  <div className="order-customer__tel" children={order.Client.phone} />
                </div>
              </div>
              <div className="pay-method-form__submit">
                <button
                  className="button-submit"
                  children={t("Pay") + ` ${currentPayment.price}${order.currency.sign}`}
                  onClick={initPay}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
