# JAH Trading Journal
GitHub-inspired personal trading journal. Native Next.js for Vercel, with Supabase Auth, Postgres, and private chart storage. Starts empty; no reference reports or example trades are imported.

## Deploy
1. Create a Supabase project and run the complete `supabase/schema.sql` once in its SQL Editor. It creates the journal table, owner-only RLS policies, revision trigger and private chart bucket.
2. Import this GitHub repository into Vercel. Framework: Next.js; Node: 22 or newer. Default build command `npm run build`.
3. Add these environment variables to Vercel Production (and Preview if needed):
   - `NEXT_PUBLIC_SUPABASE_URL`: your project URL.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: your publishable API key.
   Never use a service-role or secret key. These public values are safe only with the included RLS policies.
4. Deploy. In Supabase Authentication → URL Configuration, set Site URL to the production Vercel URL and add that URL followed by `/auth/callback` to allowed redirects. For local development allow `http://localhost:3000/auth/callback`. Add only preview domains you actually use.
5. Open the site, create your account, confirm your email, and sign in. Use the **same email account and same Supabase project** on every device. Production email delivery may need your own SMTP configuration in Supabase.
6. To keep this personal, after creating your account disable new signups in Supabase Auth settings.

## Shared data and conflicts
The database is the source of truth. There is no separate localStorage journal or offline save mode. Reads bypass caches. Active tabs check every 15 seconds and on focus/online. Forms pause refresh to preserve drafts. Every write compares the database revision atomically; conflicting writes return HTTP 409 instead of overwriting newer data. Copy unsaved notes, close the form (or leave Settings), wait for sync and retry. Reflection drafts remain visible while other entries refresh.

Accounts, trades, daily goals and reflections share one owner-protected journal row. Charts use private storage paths under the user ID. Other logins deliberately see separate journals. GitHub stores code, not journal records.

## Features
- Funding Pips, FundedNext, Goat Funded Trader, other firms and custom names
- Preset and custom account sizes; Futures whole contracts and CFD fractional lots
- Fees, net P&L, realized drawdown, win rate, equity curve, calendar, daily/weekly reviews
- Private PNG/JPEG/WebP charts up to 3 MB, notes, CSV/JSON exports, PDF printing
- Responsive dark UI, motion and mountain photo credited in the footer

## Local development
```sh
npm ci
cp .env.example .env.local
npm run dev
```
Fill the two variables before signing in. Without them the app shows setup instructions.

```sh
npm test
npm run typecheck
npm run build
```

## Before using real records
Verify with two browsers: sign in with the same account, add an account/trade on one, then focus the other. Open edit forms on both and save different changes: the second save must report a conflict. A different login must not see the first user's data or chart URLs. Verify logout and private chart access. These live checks require a configured Supabase project.

## Existing Sites version
This standalone Vercel version uses a new Supabase database. It does not automatically migrate records or charts from the earlier ChatGPT Sites version. Export any existing records there before migration; its deployment is unchanged.

## Limits
USD accounting, India trading dates; no broker connection. The journal API supports up to 100 accounts, 5,000 trades and 1.5 MB of JSON. Removed chart attachments remain in private storage; review storage usage periodically. JSON exports contain chart references, not image bytes. Back up chart files separately.
