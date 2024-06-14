import { StripeElementStyle, StripeIbanElementChangeEvent, StripeIbanElementOptions } from "@stripe/stripe-js";
import { Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormContainer, IbanError, IbanInput, IbanLabel, SepaInput, SepaMandate } from "./styles";

const IBAN_STYLE: StripeElementStyle = {
  base: {
    color: '#111',
    fontSize: '18px',
    '::placeholder': {
      color: '#C4C4C4'
    },
    ':-webkit-autofill': {
      color: '#111',
    },
  },
  invalid: {
    color: '#DB0000',
    iconColor: '#DB0000',
    ':-webkit-autofill': {
      color: '#DB0000',
    },
  },
  complete: {
    iconColor: "#389D31",
    color: "#4BB543"
  }
};

const SEPA_OPTIONS: StripeIbanElementOptions = {
  supportedCountries: ['SEPA'],
  placeholderCountry: "EN",
  style: IBAN_STYLE
}

interface SepaFormProps {
  buttonText?: string
  defaultValues?: { accountholder?: string, email?: string }
  onSubmit?: (values: { name: string, email: string }) => void
}

export default function SepaForm({ buttonText, defaultValues, onSubmit = () => { } }: SepaFormProps) {
  const { t } = useTranslation()
  const [form] = useForm()

  const [ibanReady, setIbanReady] = useState(false)
  const [ibanEvent, setIbanEvent] = useState<StripeIbanElementChangeEvent | null>(null)
  const [values, setValues] = useState<Array<any>>([])

  const hasErrors = values.some(item => item.errors.length > 0) || values.length === 0
  const buttonDisabled = hasErrors || !!ibanEvent?.error || !ibanEvent?.complete

  return (

    <FormContainer
      form={form}
      initialValues={defaultValues}
      layout="vertical"
      style={{ visibility: ibanReady ? "visible" : "hidden" }}
      onFieldsChange={(_, vals) => setValues(vals)}
      onFinish={(values: any) => onSubmit({ name: values.accountholder, email: values.email })}
    >
      <Form.Item rules={[{ required: true, message: t("OrderPayment.Validation.FieldMustBeSet") }]} label={t("FullName")} name="accountholder">
        <SepaInput placeholder="John Smith" />
      </Form.Item>

      <Form.Item rules={[{ required: true, message: t("OrderPayment.Validation.FieldMustBeSet") }]} label={t("Email")} name="email">
        <SepaInput placeholder="test@careerum.com" />
      </Form.Item>

      <IbanLabel children="IBAN" />
      <IbanInput
        options={SEPA_OPTIONS}
        onChange={evt => setIbanEvent(evt)}
        onReady={() => setIbanReady(true)}
      />
      {ibanEvent?.error && <IbanError children={ibanEvent.error?.message} />}

      <SepaMandate children={t("OrderPayment.SepaMandate")} />

      <Form.Item>
        <button
          type="submit"
          className="button-submit"
          disabled={buttonDisabled}
          children={buttonText}
        />
      </Form.Item>
    </FormContainer>
  )
}
