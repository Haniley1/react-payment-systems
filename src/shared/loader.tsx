import styled, { keyframes } from "styled-components";

interface PageLoaderProps {
  title?: React.ReactNode
}

export const PageLoader = ({ title }: PageLoaderProps) => {
  return (
    <LoaderWrapper>
      {title && <LoaderTitle children={title} />}
      <LoaderSpinner />
    </LoaderWrapper>
  )
}

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: #fff;
`

const LoaderKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const LoaderTitle = styled.span`
  position: absolute;
  bottom: 57%;
  max-width: 60vw;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
`

export const LoaderSpinner = styled.span`
  width: 64px;
  height: 64px;
  border: 3px solid #FF6A01;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: ${LoaderKeyframes} 1s linear infinite;

  &::after {
    content: '';  
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    background: #FF6A01;
    width: 17px;
    height: 17px;
    transform: translate(-50%, 50%);
    border-radius: 50%;
  }
`
