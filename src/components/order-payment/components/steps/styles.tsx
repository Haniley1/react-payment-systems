import styled from "styled-components";

export const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 572px;

  .steps-item:nth-child(5) > * {
    font-weight: 700;
  }
`

export const StepsItemContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px;
`

export const StepCounter = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  border: 2px solid #000;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  flex-shrink: 0;
`

export const StepTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  line-height: 25px;
`
