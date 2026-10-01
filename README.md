# Kosha — E-commerce Dashboard

A production-style storefront built with **Next.js 16 (App Router) + TypeScript**, backed by the [Fake Store API](https://fakestoreapi.com/docs).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

**Test login:** `mor_2314` / `83r5^_` (or click "Sign in with test account").

### Error and loading states

- Expected API failures are caught in the page and shown with `ErrorState`, which offers a retry and a friendly message.
- Unexpected errors fall through to `error.tsx` boundaries.
- `loading.tsx` skeletons are shown while server data streams in.
