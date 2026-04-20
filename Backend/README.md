# API Mock Data Backend

Backend service for generating rule-based mock API data.

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
    },
    "latency": 1000,
    "errorRate": 30
  }
  ```
- `latency`: optional integer (ms, 0-30000, default 0) - simulates response delay
- `errorRate`: optional integer (0-100, default 0) - % chance to return 500 error for resilience testing
- Validation via `ruleValidation.service`

### Dynamic URL

`GET /dynamic` (auth-required) --> auth based on API key
`POST /dynamic/:ruleId` (auth-required)

- Creates a mock URL and authenticates it with a API key that was created with the user
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

## Latency Simulation

Mock APIs can simulate real-world delays by setting `latency` (in ms) when creating rules. The delay is applied before sending the response in the mock endpoint.

Example: `latency: 2000` adds a 2-second delay.

## Common Errors

- 401 unauthorized: missing or invalid JWT cookie or `Authorization: Bearer <token>`
- 404 route not found: path must be `/dynamic/api/mock/{apiKey}/{endpoint}` via dynamic route
- 400 validation error: request payload fails Zod schema
