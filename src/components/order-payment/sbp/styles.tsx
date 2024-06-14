import styled from "styled-components";

export const SBPPaymentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0 140px;

  @media (max-width: 1024px) {
    height: auto;
  }
`

export const SBPPaymentTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  line-height: 42px;
  margin-bottom: 40px;
`

export const SBPPaymentInnerContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

export const QRCodeContainer = styled.div`
  width: 376px;
  height: 376px;
  padding: 12px;
  margin-right: 32px;
  border: 2px solid #D9D9D9;
  border-radius: 30px;

  & > svg {
    transform: scale(2);
    transform-origin: left top;
  }
`

export const LoaderWrapper = styled(QRCodeContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
`
