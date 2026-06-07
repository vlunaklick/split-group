# Split Group

Web app to split shared expenses with friends, family, or roommates. Create groups, track spending, settle debts, and export reports.

## Features

- Shared groups with invite links and admin/member roles
- Expenses with categories, currencies, and equal or custom splits
- Debt tracking, payments, and forgiveness
- Dashboard with spending stats and charts
- In-app and email notifications
- PDF and Excel export
- Public expense calculator (no account required)

## Tech stack

Next.js 14 · TypeScript · PostgreSQL · Prisma · NextAuth · Tailwind CSS · shadcn/ui · React Hook Form · Zod · SWR · Resend · Playwright

## Getting started

**Requirements:** Node.js 20+, PostgreSQL

```bash
git clone git@github.com:vlunaklick/split-group.git
cd split-group
npm install
cp .env.example .env   # fill in values below
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Session secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Prod | App URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY` | No | Email delivery via Resend |
| `PAGE_URL` | No | Public domain for email links (no protocol) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint |
| `npm test` | Playwright E2E tests |
| `npm run db:seed` | Seed database |

## Design

Editorial design system spec: [`design.md`](./design.md).
