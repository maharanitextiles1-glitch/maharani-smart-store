# Maharani Smart Store

Mobile-first indoor showroom navigation MVP for Maharani Wedding Collections.

## Stack
- Customer PWA: React + TypeScript + Tailwind + Vite
- Admin: React + TypeScript + Tailwind + Vite
- API: Node.js + Express + TypeScript
- DB: MongoDB + Mongoose
- Auth: JWT
- QR: qrcode
- Maps: dynamic SVG generated from MongoDB section coordinates

## Local setup

1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `server/.env`.
3. Install dependencies from the project root:
   npm install
4. Seed demo data:
   npm run seed
5. Start all three apps:
   npm run dev

Customer: http://localhost:5173
Admin: http://localhost:5174
API: http://localhost:5000

Demo admin:
- Email: admin@maharani.local
- Password: Maharani@123

Change the demo password immediately for production.

## Production build
npm run build

Deploy the three apps separately or serve the built React apps behind a reverse proxy. Use MongoDB Atlas in production and set strong secrets.
