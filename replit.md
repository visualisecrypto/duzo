# DuZo Marketplace

A React Native marketplace prototype connecting Nigerian buyers with verified suppliers, product listings, and quote requests.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/duzo-mobile run dev` — run the DuZo Expo mobile app
- `pnpm --filter @workspace/duzo-mobile run typecheck` — typecheck the mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9, Expo and React Native
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/duzo-mobile` — Expo app and marketplace screens
- `artifacts/duzo-mobile/assets/images` — DuZo wordmark and marketplace imagery
- `artifacts/api-server` — shared Express API scaffold

## Architecture decisions

- The first build is a front-end prototype; buyer/seller mode, quote requests, chat, and new listings use local in-memory state.

## Product

DuZo brings together Nigerian business buyers and verified suppliers. The mobile prototype includes buyer discovery, supplier profiles, product details, quotes and messaging, plus a seller overview, catalogue, trade requests, and inbox.

## User preferences

_No additional project-specific preferences recorded._

## Gotchas

_No additional app-specific gotchas._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
