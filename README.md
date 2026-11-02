# BOLESI Storefront

Next.js storefront for BOLESI COMPANY LIMITED. The frontend is deployed through the Vercel project `bolesi` and connects to the separate Express/PostgreSQL backend.

## Live architecture
- Frontend repository: https://github.com/joab8291-glitch/bolesi
- Backend repository: https://github.com/joab8291-glitch/bolesi-backend
- Frontend: Vercel
- API: Render
- Database: Render PostgreSQL + Prisma
- Currency: KES
- Payments: M-Pesa Daraja STK Push and pay at shop / collection
- Fulfilment: collection and configurable home delivery
- Inventory: branch-level stock
- Administration: one super administrator

## Frontend routes
- `/` — BOLESI homepage
- `/shop` — catalogue search and product cards
- `/product/[slug]` — product detail
- `/cart` — shopping bag
- `/checkout` — contact details, branch, fulfilment and payment selection
- `/admin` — first super-admin setup and sign-in, with basic order view

## Local development
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_API_URL` to the backend URL.
5. Run `npm run dev`.

## Vercel
The Vercel project has `NEXT_PUBLIC_API_URL=https://bolesi-backend.onrender.com` configured for production, preview and development. Keep this value aligned with the Render service URL.

## Important launch gates
- Connect the Render PostgreSQL internal URL as backend `DATABASE_URL` and verify Prisma schema sync.
- Add verified BOLESI branch records and their inventory.
- Load only confirmed product prices, specifications, images and warranty information.
- Configure delivery fees only after BOLESI confirms the fee rules.
- Supply BOLESI's own Daraja production credentials before enabling live M-Pesa.
- Run end-to-end order, callback, stock and admin access tests before accepting live customer payments.

The catalogue starts empty rather than publishing guessed stock, prices or branch details. The starter category taxonomy is created by the backend after its database connection is configured.
