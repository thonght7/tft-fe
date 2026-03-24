# tft-frontend

Nuxt 3 frontend cho hệ thống TFT boosting (modular monolith backend).

## Run

```bash
npm i
npm run dev
```

## Configure API base

Set env:

```bash
export NUXT_PUBLIC_API_BASE=http://localhost:8080
```

## Pages (MVP)

- `/` landing
- `/login`, `/register`
- `/order/new` create order + auto pricing
- `/orders` list my orders
- `/orders/:id` order detail + mock payment button
- `/boosters` browse boosters

## Backend endpoint assumptions

This FE gọi các endpoint (có thể chỉnh theo backend thực tế):

- `POST /api/auth/login` => `{ tokens, user }`
- `POST /api/auth/register`
- `POST /api/auth/refresh` => tokens
- `GET /api/boosters` public list
- `POST /api/pricing/calculate` => `{ price }`
- `POST /api/orders` create
- `GET /api/orders/me` list
- `GET /api/orders/:id` detail
- `POST /api/payments/mock`
