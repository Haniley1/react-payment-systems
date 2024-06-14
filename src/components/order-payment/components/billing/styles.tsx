import { Form, Input, Select } from "antd";
import styled from "styled-components";

export const BillingForm = styled(Form)`
  width: 100%;
  margin: 32px 0;

  @media (max-width: 1299px) {
    width: 366px;
    margin: 0;
  }

  @media (max-width: 578px) {
    width: 294px;
    margin-top: 32px;
  }
`

export const ThemedSelect = styled(Select)`
  &.ant-select.ant-select-single {
    .ant-select-selector {
      height: 48px;
      padding: 0 12px;
      border: 2px solid #0000007A;
      border-right-width: 2px !important;
      border-radius: 8px;

      .ant-select-selection-search input {
        height: 46px;
        color: #000;
      }

      .ant-select-selection-placeholder, .ant-select-selection-item {
        align-self: center;
        color: #000;
      }
      
      .ant-select-selection-placeholder {
        color: #0000007A;
      }

      .ant-select-selection-placeholder, .ant-select-selection-item, input {
        font-size: 16px;
        font-weight: 400;
        line-height: 170%;
      }

      &:hover {
        outline: none;
        border: 2px solid #000;
        border-right-width: 2px !important;
        box-shadow: none;
      }
    }

    &.ant-select-focused .ant-select-selector {
      box-shadow: none !important;
      border-color: #000;
      border-right-width: 2px !important;
    }

    &.ant-select-open {
      .ant-select-selector {
        outline: none;
        border: 2px solid #000;
        border-right-width: 2px !important;
        box-shadow: none;
      }
    }

    @media (max-width: 578px) {
      .ant-select-selector {
        height: 40px;

        .ant-select-selection-search input {
          height: 38px;
        }

        .ant-select-selection-placeholder, .ant-select-selection-item, input {
          font-size: 12px;
        }
      }
    }
  }
`

export const ThemedInput = styled(Input)`
  height: 48px;
  padding: 0 12px;
  border: 2px solid #0000007A;
  border-right-width: 2px !important;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 170%;

  &:focus, &:hover {
    outline: none;
    border: 2px solid #000;
    border-right-width: 2px !important;
    box-shadow: none;
  }

  &::placeholder {
    font-size: 16px;
    font-weight: 400;
    line-height: 170%;
    color: #0000007A;
  }

  @media (max-width: 578px) {
    height: 40px;
    font-size: 12px;

    &::placeholder {
      font-size: 12px;
    }
  }
`
