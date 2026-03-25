# API Mock Data Backend

Backend service for generating rule-based mock API data.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Run Local](#run-local)
- [Routes](#routes)
  - [Auth](#auth)
  - [User](#user)
  - [Rule](#rule)
  - [Dynamic URL](#dynamic-url)
  - [Mock API](#mock-api)
- [Data Workflow](#data-workflow)
- [Testing](#testing)
- [Validation](#validation)
- [Common Errors](#common-errors)

## Prerequisites

- Node.js 18+ (preferred)
- npm 10+
- Postgres running (use drizzle config for DB URL)

## Run Local

```bash
cd Backend
npm install
npm run dev
```

Server runs at: `http://localhost:5000`

## Health

- `GET /health` → `Server good`

## Routes

### Auth

`POST /auth/register`

- Body: `{ name, email, password }`
- Response: user + access/refresh cookies

`POST /auth/login`

- Body: `{ email, password }`
- Response: user + access/refresh cookies

`GET /auth/me`

- Requires auth (cookie or header)
- Response: `{ user }`

`POST /auth/refresh`

- Requires refresh cookie
- Response: new auth cookies

`POST /auth/logout`

- Clears auth cookies

### User

`POST /user`

- Body: `{ name, email, password }`

`GET /user`

- Requires auth

### Rule

`GET /rule` (auth-required)
`POST /rule` (auth-required)

- Body:
  ```json
  {
    "endpoint": "/users",
    "dataSchema": {
      "fullName": "person.fullName",
      "email": "internet.email"
    }
  }
  ```
- Validation via `ruleValidation.service`

### Dynamic URL

`GET /dynamic` (auth-required)
`POST /dynamic/:ruleId` (auth-required)

- Creates a mock URL (no userId in output path)
- URL template: `http://localhost:5000/dynamic/api/mock/{apiKey}/{endpoint}`

### Mock API

`GET /dynamic/api/mock/:rest` (auth-required)

- `:rest` must hold: `{apiKey}/{endpointPath}`
- Example: `/dynamic/api/mock/15b9ff900209656ebdffa5f18927b52a4d5513481f06040fda5f325324679ed6/products`
- Responds with fake data from matching rule schema

## Data Workflow

1. Register user (creates `api_key`)
2. Login (stores access and refresh cookies)
3. `POST /rule` to create a rule with endpoint and dataSchema
4. `POST /dynamic/:ruleId` to create a dynamic URL record
5. Query `GET /dynamic/api/mock/:apiKey/:endpoint` for fake data

## Testing

**TESTS GENERATOR FUNCTIONS**

```bash
cd Backend
npm test -- --run
```

Includes unit tests:

- `createDynamicUrl.test.ts`
- `dataGenerator.test.ts`
- `urlCreator.test.ts`
- `apiKeyGenerator.tets.ts`

## Validation

- Auth: `authValidation.service.ts` (Zod)
- Rule: `ruleValidation.service.ts` (Zod)
- Dynamic API params: `dynamicUrlValidation.service.ts` (Zod)
- Path param parser in `dynamicUrl.controller.ts`

## Common Errors

- 401 unauthorized: missing or invalid JWT cookie or `Authorization: Bearer <token>`
- 404 route not found: path must be `/dynamic/api/mock/{apiKey}/{endpoint}` via dynamic route
- 400 validation error: request payload fails Zod schema
