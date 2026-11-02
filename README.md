# BOLESI storefront and admin (Next.js 14)

Frontend for https://bolesi-backend.onrender.com. Deploys to the Vercel project `bolesi`.

## Setup
1. Upload these files to the root of the `bolesi` GitHub repo (Vercel redeploys on push).
2. In Vercel, set `NEXT_PUBLIC_API_URL=https://bolesi-backend.onrender.com` (already set earlier).
3. In Render (bolesi-backend), set `ALLOWED_ORIGINS` to your Vercel URL, e.g. `https://bolesi.vercel.app`.
4. Open `/admin-setup` once to create the super admin with your `ADMIN_SETUP_TOKEN`, then sign in at `/login`.
5. Add categories, products, branches and per-branch stock from `/admin`.

Local: `npm install && npm run dev`.

## If something does not match the API
All requests go through `lib/api.js`. Response and field names (`normProduct`, `normOrder`) are normalised there, and request bodies are built in the checkout page and the admin pages.
