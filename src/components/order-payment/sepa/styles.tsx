import { IbanElement } from "@stripe/react-stripe-js";
import { Form, Input } from "antd";
import styled from "styled-components";

export const FormContainer = styled(Form)`
  width: 600px;
  margin: 0 auto;

  .ant-form-item {
    margin-bottom: 15px;
  }

  label {
    font-size: 16px;
    font-weight: 500;
  }

  button[type='submit'] {
    margin-top: 20px;
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const IbanLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;

  &::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
  }
`

export const IbanInput = styled(IbanElement)`
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0.48);
  transition: border-color 200ms ease;

  &:hover, &.StripeElement--focus {
    border-color: #000;
  }

  &.StripeElement--invalid {
    border-color: #ff4d4f;
  }

  &.StripeElement--complete {
    border-color: #4BB543;
  }
`

export const IbanError = styled.div`
  color: #ff4d4f;
`

export const SepaInput = styled(Input)`
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0.48);

  &:hover, &:focus {
    border-color: #000;
    box-shadow: none;
  }

  &::placeholder {
    color: #C4C4C4;
    font-size: 16px;
    font-weight: 400;
  }
`

export const SepaMandate = styled.div`
  font-size: 13px;
  margin-top: 15px;
  text-align: justify;
`
