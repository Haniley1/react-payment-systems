import { AddressElement, LinkAuthenticationElement, PaymentElement } from "@stripe/react-stripe-js";
import { StripeAddressElementOptions } from "@stripe/stripe-js";
import { Col, Drawer, Row, Skeleton } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BillingAddress, Client } from "~/api/model";

interface IStripePaymentComponentProps {
  show: boolean
  billing?: BillingAddress
  client?: Client
  buttonText?: string
  email?: string
  buttonClass?: string
  onClose: () => void
  onSubmitPay: VoidFunction
}

const StripePaymentComponent = (props: IStripePaymentComponentProps) => {
  const { t } = useTranslation();

  const [stripeLoading, setStripeLoading] = useState(true)

  const addressElementOptions: StripeAddressElementOptions = {
    mode: "billing",
    defaultValues: {
      name: props.client?.fullName,
      address: props.billing ? {
        country: props.billing.country,
        city: props.billing.city,
        line1: props.billing.address,
        postal_code: props.billing.zip
      } : undefined
    }
  }

  return (
    <Drawer
      title={t('OrderPayment.Label')}
      width="100vw"
      onClose={() => {
        props.onClose()
        setStripeLoading(true)
      }}
      open={props.show}
      destroyOnClose
    >
      <Skeleton loading={stripeLoading} />
      <Row
        justify="center"
        style={{ visibility: stripeLoading ? "hidden" : "visible" }}
      >
        <Col lg={10} md={16} sm={16} xs={24} >
          <div style={{ marginBottom: 10 }}>
            <LinkAuthenticationElement
              options={{ defaultValues: { email: props.email || "" } }}
            />
          </div>
          <PaymentElement onReady={() => setStripeLoading(false)} />
          <br />
          <AddressElement options={addressElementOptions} />
          <button
            className={props.buttonClass || "submit-button"}
            children={props.buttonText || t("Pay")}
            onClick={props.onSubmitPay}
            style={{ marginTop: 16, width: "100%" }}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default StripePaymentComponent;
