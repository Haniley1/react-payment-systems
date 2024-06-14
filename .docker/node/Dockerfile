
FROM node:16-alpine AS builder
RUN mkdir -p /root/.npm && chown -R 1000:1000 "/root/.npm"

WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig*.json ./
RUN npm install 
COPY . .
# Передача переменных окружения во время сборки

ARG EXTEND_ESLINT=true
ARG REACT_APP_API_PROTOCOL=https://
ARG REACT_APP_PLATFORM_API_URL=backend.careerum.com/api/v1
ARG REACT_APP_LANDING_APP_URL=careerum.ru
ARG REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51O0rFwJwnIhc9QoKxtur5Ee6Rv0aSY9ulYMxp9v9Q83Noo8rxGPvPMnBuC1UxNRTJ4yN9GMknfwz5gssZPfh2pX500EpYpQXwJ

ENV EXTEND_ESLINT=${EXTEND_ESLINT}
ENV REACT_APP_API_PROTOCOL=${REACT_APP_API_PROTOCOL}
ENV REACT_APP_PLATFORM_API_URL=${REACT_APP_PLATFORM_API_URL}
ENV REACT_APP_LANDING_APP_URL=${REACT_APP_LANDING_APP_URL}
ENV REACT_APP_STRIPE_PUBLIC_KEY=${REACT_APP_STRIPE_PUBLIC_KEY}

RUN npm run build

FROM nginx:alpine AS prod
COPY --from=builder /app/build /usr/share/nginx/html
COPY .docker/node/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]