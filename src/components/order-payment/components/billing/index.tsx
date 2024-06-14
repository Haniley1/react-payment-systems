import { Col, Form, Row, notification } from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BillingAddress, Order } from "~/api/model";
import countries from "~/api/services/json/countries.json";
import { OrdersService } from "~/api/services/orders-service";
import i18n from "~/i18n";
import { BillingForm, ThemedInput, ThemedSelect } from "./styles";

interface OrderPaymentBillingProps {
  order: Order;
  values?: BillingAddress;
  onChange?: (values: BillingAddress) => void;
}

interface CountryOption {
  value: string;
  label: string;
  labelRu: string;
  labelEn: string;
}

interface UserGeo {
  country_code: string;
  city: string;
  postal: string;
}

export default function OrderPaymentBilling({ order, values, onChange = () => {} }: OrderPaymentBillingProps) {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [userGeo, setUserGeo] = useState<UserGeo | null>(null)
  const [saveTimer, setSaveTimer] = useState<number | undefined>(undefined)

  const countryLabelKey = i18n.language === "ru" ? "nameRu" : "nameEn"

  const parsedCountries = useMemo((): Array<CountryOption> => {
    return Object.values(countries).map(item => ({
      value: item.iso,
      label: item[countryLabelKey],
      labelRu: item.nameRu,
      labelEn: item.nameEn
    }))
  }, [countryLabelKey])

  const handleFieldsChange = () => {
    window.clearTimeout(saveTimer)

    const values = form.getFieldsValue()
    const timer = window.setTimeout(saveBillingValues, 3_000, values)

    onChange(values)
    setSaveTimer(timer)
  }

  const saveBillingValues = (values: BillingAddress) => {
    if (order.currency.code !== "EUR") return;

    OrdersService.setBillingAddress(order.id, values)
      .catch(() => {
        notification.error({ message: "Billing Error" });
      });
  }

  const handleCountriesSearch = (search: string, option: CountryOption) => {
    return (
      option.labelRu.toLowerCase().includes(search.toLowerCase()) ||
      option.labelEn.toLowerCase().includes(search.toLowerCase())
    )
  }

  useEffect(() => {
    form.setFieldsValue(values)
  }, [form, values])

  useEffect(() => {
    const fetchGeoData = async () => {
      const response = await axios.get<UserGeo>("https://ipapi.co/json/")

      if (!response.data) return

      form.setFieldsValue({
        country: response.data.country_code,
        city: response.data.city,
        zip: response.data.postal
      })

      const values = form.getFieldsValue()

      onChange(values)
      saveBillingValues(values)
      setUserGeo(response.data)
    }

    if (!userGeo && !values?.country) {
      fetchGeoData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, userGeo, values?.country])

  return (
    <BillingForm form={form} onFieldsChange={handleFieldsChange}>
      <div className="page-subheader-text" children={t("OrderPayment.BillingAddress")} style={{ marginBottom: 10 }} />
      <Row gutter={4} >
        <Col xs={24} sm={16} xl={16} >
          <Form.Item name="country" required style={{ marginBottom: 4 }}>
            <ThemedSelect
              showSearch
              showArrow={false}
              // @ts-ignore
              filterOption={handleCountriesSearch}
              placeholder={t("OrderPayment.Country") + "*"}
              options={parsedCountries}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} xl={8} >
          <Form.Item name="zip" style={{ marginBottom: 4 }}>
            <ThemedInput placeholder={t("OrderPayment.ZipCode")} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="city" style={{ marginBottom: 4 }}>
            <ThemedInput placeholder={t("OrderPayment.City")} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="address" style={{ marginBottom: 0 }}>
            <ThemedInput placeholder={t("OrderPayment.AddressLine")} />
          </Form.Item>
        </Col>
      </Row>
    </BillingForm>
  )
}
