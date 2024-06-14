/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { notification } from 'antd';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from "react-router";
import { AppRoutes, ORDER_TINKOFF_INIT_URL, Order, STRIPE_CREATE_PAYMENT_INTENT_URL } from '~/api/model';
import { declOfNum } from '~/api/utils/strings';
import '~/assets/fonts/montserrat/index.scss';
import { ReactComponent as ArrowLeftSvg } from "~/assets/svg/arrow-left.svg";
import { ReactComponent as CheckSvg } from "~/assets/svg/check.svg";
import { ReactComponent as CoinSvg } from "~/assets/svg/coin.svg";
import { ReactComponent as FenceSvg } from "~/assets/svg/fence.svg";
import { ReactComponent as VaultSvg } from "~/assets/svg/vault.svg";
import { IStripeCreatePaymentIntentResponse } from '../order-payment/hooks/useBrandPayment';
import StripePaymentComponent from '../order-payment/stripe/stripe-payment';
import SheduleList from "./components/SheduleList";
import "./style.sass";

interface OrderCareerumLoanProps {
  order: Order;
  onSuccess: () => void
  onError: (err: any, prefix?: string) => void
}

export default function OrderCareerumLoan({ order, onSuccess, onError }: OrderCareerumLoanProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { t, i18n } = useTranslation()
  const history = useHistory()

  const [showStripePayment, setShowStripePayment] = useState(false)
  const [termAgreed, setTermAgreed] = useState(false)

  const offer = order?.offerPositions[0].offer
  const firstPayment = offer.innerInstallmentPaymentAmounts ? offer.innerInstallmentPaymentAmounts[0] : 0
  const loanMonths = offer.innerInstallmentPaymentAmounts?.length

  const textMonths = i18n.language === "ru" ? ["месяц", "месяца", "месяцев"] : ["month", "months", "months"]

  const paymentMetadata = useMemo(() => ({
    orderId: `${order.id}/1ii`,
    clientId: order?.clientId,
    payerEmail: order.Client.email,
  }), [order.Client.email, order?.clientId, order.id])

  const paymentReturnUrl = useMemo(() => {
    if (!order?.hash) {
      return window.location.href
    }

    return `${window.location.href}?order_hash=${order.hash}`
  }, [order.hash])

  const onPaySuccess = () => {
    setShowStripePayment(false)
    onSuccess()
  };

  const onPayError = useCallback((err?: any, prefix: string = '') => {
    setShowStripePayment(false)
    onError(err, prefix)
  }, [onError]);

  const handleStripeSubmitPay = useCallback(async () => {
    if (!stripe || !elements) return;

    notification.info({ message: t("Processing") })

    // @ts-ignore
    const { error: elementsError } = await elements.submit();
    if (elementsError) {
      onPayError(elementsError.message)
      return
    }

    const { data: { clientSecret, success, message } } = await axios.post<IStripeCreatePaymentIntentResponse>(STRIPE_CREATE_PAYMENT_INTENT_URL, {
      amount: firstPayment * 100,
      currency: order?.currency.code,
      metadata: paymentMetadata
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, elements, t, firstPayment, order?.currency.code, paymentMetadata, paymentReturnUrl]);

  const initPay = useCallback(async () => {
    switch (order.currency.code) {
      case "RUB":
        notification.info({ message: t("OrderPayment.LoadingPaymentPage") })

        const { data: { success, payUrl, message } } = await axios.post<{ success: boolean, payUrl: string, message: string }>(ORDER_TINKOFF_INIT_URL, {
          amount: firstPayment * 100,
          orderId: order?.id,
          title: offer.title,
          email: order?.Client.email,
          clientId: order?.Client.id,
          metadata: paymentMetadata,
          language: i18n.language,
          // Return to the current url after payment
          returnUrl: paymentReturnUrl
        });

        if (success) {
          window.location.href = payUrl;
        } else {
          onPayError(message, 'Tinkoff');
        }

        break;
      case "EUR":
        setShowStripePayment(true)
        break;
    }
  }, [firstPayment, i18n.language, offer.title, onPayError, order, paymentMetadata, paymentReturnUrl, t])

  const handleBackPage = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault()

    if (order.id) {
      history.push(AppRoutes.orderPayment.replace(":hash", order.hash || order.id.toString()))
    }
  }

  // Update Stripe instances on price update
  useEffect(() => {
    const price = parseFloat((firstPayment * 100).toFixed(2))

    if (elements && firstPayment !== 0 && order.currency) {
      elements.update({
        amount: price,
        currency: order.currency.code.toLocaleLowerCase()
      })
    }
  }, [elements, firstPayment, order])

  return (
    <div className="pay-share">
      <StripePaymentComponent
        show={showStripePayment}
        email={order.Client.email}
        buttonText={t("Pay") + ` ${firstPayment}${order.currency.sign}`}
        buttonClass='submit__button'
        onClose={() => setShowStripePayment(false)}
        onSubmitPay={handleStripeSubmitPay}
      />
      <div className="loan-container">
        <div className="button-back">
          <a href="#" onClick={(handleBackPage)}>
            <ArrowLeftSvg />
            {t("Back")}
          </a>
        </div>
        <div className="pay-share-header">
          <div className="tariff-description">
            <p children={offer.title + ". "} />
            <Trans i18nKey="CareerumLoan.ProgrammDuration" values={{ months: `${loanMonths} ${declOfNum(loanMonths!, textMonths)}` }}>
              <span className="tariff-length" />
            </Trans>
          </div>
          <div className="header">
            <p children={t("CareerumLoan.Title")} />
          </div>
        </div>
        <div className="pay-share-description">
          <div className="description__left">
            <p className="description__header" children={t("CareerumLoan.DescriptionTitle")} />
            <p className="description__subheader">
              <Trans i18nKey="CareerumLoan.HaveQuestions">
                <a href="mailto:hello@careerum.com" children="hello@careerum.com" />
              </Trans>
            </p>
          </div>
          <div className="description__item-wrapper">
            <div className="description__items">
              <div className="description__item">
                <CoinSvg />
                <p>
                  <span children={t("CareerumLoan.DescriptionItem1Top")} />
                  {t("CareerumLoan.DescriptionItem1Bottom")}
                </p>
              </div>
              <div className="description__item">
                <FenceSvg />
                <p>
                  <span children={t("CareerumLoan.DescriptionItem2Top")} />
                  <br />
                  {t("CareerumLoan.DescriptionItem2Bottom")}
                </p>
              </div>
              <div className="description__item">
                <VaultSvg />
                <p>
                  <span children={t("CareerumLoan.DescriptionItem3Top")} />
                  <br />
                  {t("CareerumLoan.DescriptionItem3Bottom")}
                </p>
              </div>
            </div>
          </div>
          <div className="description-md">
            <p className="description__subheader">
              <Trans i18nKey="CareerumLoan.HaveQuestions">
                <a href="mailto:hello@careerum.com" children="hello@careerum.com" />
              </Trans>
            </p>
          </div>
        </div>
        <div className="pay-share-shedule">
          <div className="shedule__left">
            <p className="shedule__header" children={t("CareerumLoan.PersonalShedule")} />
          </div>
          <SheduleList
            items={offer.innerInstallmentPaymentAmounts}
            currency={order.currency}
          />
        </div>
        <div className="pay-share-submit">
          <div className="submit__checkbox">
            <input
              type="checkbox"
              id="agree"
              checked={termAgreed}
              onChange={() => setTermAgreed(!termAgreed)}
            />
            <label htmlFor="agree">
              <CheckSvg />
            </label>
            <p>
              <Trans i18nKey="CareerumLoan.AcceptProgramm">
                <a href="https://careerum.com/ru-ru/legal/installment" target="_blank" rel="noreferrer" />
              </Trans>
            </p>
          </div>
          <button
            className="submit__button"
            disabled={!termAgreed}
            children={t("Pay")}
            onClick={initPay}
          />
        </div>
      </div>
    </div>
  )
}
