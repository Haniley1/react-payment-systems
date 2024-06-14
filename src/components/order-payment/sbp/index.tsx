import { Drawer, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ORDER_TINKOFF_INIT_SPB_URL, getOrderCompletedUrl } from "~/api/model";
import { LoaderSpinner } from "~/shared/loader";
import PaymentSteps from "../components/steps";
import { LoaderWrapper, QRCodeContainer, SBPPaymentContainer, SBPPaymentInnerContainer, SBPPaymentTitle } from "./styles";

interface SBPPaymentComponentProps {
  show: boolean;
  orderId: number;
  tinkoffArgs: any;
  onPaySuccess?: VoidFunction;
  onClose?: VoidFunction;
}

const IS_MOBILE_DEVICE = !!navigator.userAgent.toLowerCase().match(/mobile/i)

export default function SBPPaymentComponent({ show, orderId, tinkoffArgs, onClose = () => { }, onPaySuccess = () => { } }: SBPPaymentComponentProps) {
  const { t } = useTranslation()

  const [sbpInited, setSbpInited] = useState(false)
  const [sbpQRCode, setSbpQRCode] = useState<string | null>(null)
  const [completedCheckerId, setCompletedCheckerId] = useState(0)

  const initSBPPayment = async () => {
    setSbpInited(false)

    try {
      const response = await axios.post<{ image: string, link: string }>(ORDER_TINKOFF_INIT_SPB_URL, tinkoffArgs)

      if (IS_MOBILE_DEVICE && response.data.link) {
        window.location.href = response.data.link
      } else {
        setSbpQRCode(response.data.image)
      }
    } catch (error) {
      notification.error({ message: t("OrderPayment.SBP.PayError") })
      onClose()
    }

    setSbpInited(true)
  }

  const initOrderCompletedChecker = () => {
    if (completedCheckerId) return

    const checkerId = window.setInterval(isOrderCompleted, 10_000)
    setCompletedCheckerId(checkerId)
  }

  const isOrderCompleted = async () => {
    try {
      const response = await axios.get<boolean>(getOrderCompletedUrl(orderId))
  
      if (response.data === true) {
        window.clearInterval(completedCheckerId)
        onClose()
        onPaySuccess()
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (!show) {
      window.clearInterval(completedCheckerId)
      return
    }

    initSBPPayment()
    initOrderCompletedChecker()

    return () => window.clearInterval(completedCheckerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  if (IS_MOBILE_DEVICE) {
    return <></>
  }

  return (
    <Drawer
      title={t('OrderPayment.Label')}
      width="100vw"
      open={show}
      onClose={onClose}
      destroyOnClose
    >
      <SBPPaymentContainer>
        <div>
          <SBPPaymentTitle children={t("OrderPayment.SBP.Title")} />
          <SBPPaymentInnerContainer>
            {(!sbpInited || !sbpQRCode) ? (
              <LoaderWrapper>
                <LoaderSpinner />
              </LoaderWrapper>
            ) : (
              <QRCodeContainer dangerouslySetInnerHTML={{ __html: sbpQRCode }} />
            )}
            <PaymentSteps steps={[
              t("OrderPayment.SBP.Step1"),
              t("OrderPayment.SBP.Step2"),
              t("OrderPayment.SBP.Step3"),
              t("OrderPayment.SBP.Step4"),
              t("OrderPayment.SBP.Step5")
            ]} />
          </SBPPaymentInnerContainer>
        </div>
      </SBPPaymentContainer>
    </Drawer>
  );
}
