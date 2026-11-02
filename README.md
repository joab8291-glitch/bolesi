# BOLESI Ecommerce

A modern ecommerce and order-management platform for BOLESI COMPANY LIMITED, replacing the current brochure-style website with a complete online sales channel and staff administration system.

## Confirmed project decisions

- GitHub: https://github.com/joab8291-glitch/bolesi
- Currency: Kenyan shillings (KES)
- Payments: M-Pesa STK Push and pay at shop / collection
- Fulfilment: home delivery and shop collection
- Inventory: stock tracked independently by branch
- Administration: one super administrator account
- Delivery: phased implementation, complete admin dashboard included
- Primary product families: gas hobs/cookers, range hoods, ovens, microwaves, water heaters, water purifiers, smart locks, smart-home products, dishwashers, smart toilets and the Golden Diamond Series.

## Product vision

Customers can discover products, inspect technical specifications, add items to a cart, choose delivery or collection, submit an order, pay through the supported method and receive order updates. BOLESI staff manage the catalogue, branch stock, orders, fulfilment, customers, promotions and service requests through a protected admin dashboard.

## Implementation phases

### Phase 1 — Storefront and catalogue foundation
- Responsive premium storefront and navigation
- Homepage, category pages, product listing and product detail pages
- Search, sorting and catalogue filters
- Product categories and subcategories
- Product images, descriptions, SKUs/models, prices, specifications, warranty and availability
- Shopping cart and checkout experience
- Delivery versus branch collection selection
- Admin authentication and dashboard shell
- Product/category CRUD and image management

### Phase 2 — Transactions and fulfilment
- M-Pesa Daraja STK Push with server-side callback verification
- Pay-at-shop / pay-on-collection order workflow
- Idempotent order creation and payment processing
- Branch-specific inventory, stock reservation and stock movement history
- Delivery zones, configurable fees and dispatch statuses
- Branch management and collection availability
- Customer order history, order tracking, invoices and receipts

### Phase 3 — Operations and customer care
- Admin order management and status history
- Customer management
- Staff-created/manual orders
- Installation and measurement bookings
- Warranty registration and claims
- After-sales service tickets
- WhatsApp, email and SMS notifications
- Coupons, promotions, featured products and homepage content management
- Sales, stock, branch and fulfilment reports

### Phase 4 — Quality, security and launch
- End-to-end checkout and payment tests
- Role and access security review
- Mobile, accessibility and performance testing
- SEO metadata, sitemap, robots.txt and product structured data
- Backups, audit logs and production monitoring
- Domain and production deployment

## Core business rules

1. Prices are displayed in KES.
2. A customer may choose home delivery or collection from a selected BOLESI branch.
3. A branch-specific stock balance is authoritative for pickup availability.
4. The checkout must show product totals, delivery/collection details, fees and final payable amount before order submission.
5. An order paid at shop is recorded as awaiting payment until staff confirm receipt; it must never be marked paid by the browser.
6. M-Pesa orders become paid only after a verified Daraja callback and transaction reconciliation.
7. Payment callbacks and order submission must be idempotent to prevent duplicate orders or charges.
8. Stock changes and order state transitions must be auditable.
9. Product claims, warranty periods, installation coverage, branch addresses and service promises must be verified by BOLESI before publication where the existing website is inconsistent or incomplete.

## Initial catalogue taxonomy

- Kitchen Appliances
  - Gas Hobs & Cookers
  - Electric Cookers
  - Built-in Ovens
  - Microwaves
  - Range Hoods
- Water Heating
  - Instant Water Heaters
  - Gas Water Heaters
  - Storage Water Heaters
- Water Treatment
  - Water Purifiers
- Smart Home & Security
  - Smart Locks
  - Smart Home Devices
- Cleaning
  - Dishwashers
- Bathroom
  - Smart Toilets
- Collections
  - Golden Diamond Series
- Promotions

Categories must remain editable from the admin dashboard; this taxonomy is an initial proposal, not a hard-coded limit.

## Technical direction and integration gate

The repository is connected to a Vercel project named `bolesi`. Before application code is scaffolded, the commerce backend provider must be provisioned and its generated integration instructions reviewed. The preferred Vercel Marketplace commerce provider is Shopify, but its fit must be checked against the confirmed requirements for Kenyan M-Pesa STK Push, manual pay-at-shop collection and branch-level inventory. Do not claim these capabilities are live until the relevant provider configuration and end-to-end tests are complete.

The application must keep payment credentials and callbacks server-side. Never commit secrets. An `.env.example` will list variable names only after the chosen integrations and runtime architecture are confirmed.

## Source website

https://www.bolesi-kenya.com/

The current website describes BOLESI's home-appliance and smart-home product families and includes existing product models, images and specifications. Catalogue migration should preserve accurate product data and flag conflicting or missing prices, warranties and branch details for confirmation.
