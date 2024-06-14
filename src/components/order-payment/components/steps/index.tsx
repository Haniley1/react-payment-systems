import React from "react";
import { StepCounter, StepTitle, StepsContainer, StepsItemContainer } from "./styles";

interface PaymentStepsProps {
  steps: Array<React.ReactNode>
}

export default function PaymentSteps({ steps }: PaymentStepsProps) {
  return (
    <StepsContainer>
      {steps.map((step, i) => (
        <StepsItemContainer className="steps-item">
          <StepCounter children={i + 1} />
          <StepTitle children={step} />
        </StepsItemContainer>
      ))}
    </StepsContainer>
  )
}
