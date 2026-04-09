
# ceylon3D — 3D Printing E-commerce Platform

>A modern monorepo for a full-stack 3D printing e-commerce solution, featuring a Spring Boot backend and two React frontends (Landing & Shop), ready for cloud deployment.

---

## 🚀 Features
- 3D printing service homepage and e-commerce shop
- Modern React (Vite) frontends with component libraries
- Spring Boot 3.x backend (Java 17, JWT, PostgreSQL)
- Docker & docker-compose support
- Cloud-ready: Vercel, Render, Railway, Supabase, Neon
- One-command local dev & build scripts

## 🗂️ Monorepo Structure

```
backend/         # Spring Boot API, Docker, database
frontend/
	landing/       # 3D Printing Service Homepage (React)
	shop/          # E-commerce Shop (React)
scripts/         # Helper scripts (build, embed, dev)
clear-orders.js  # Node.js admin script (clear orders)
clear-orders.sql # SQL script (reset orders)
vercel.json      # Vercel deployment config (shop)
```

## 🛠️ Tech Stack
- **Backend:** Spring Boot 3.x, Java 17, PostgreSQL, JWT, Docker
- **Frontend:** React 18, Vite, Radix UI, Tailwind CSS, MUI (Shop), modern component libraries
- **DevOps:** Docker, docker-compose, Vercel, Render, Railway

## ⚡ Quick Start

### 1. Clone & Install
```sh
git clone https://github.com/your-org/ceylon3D.git
cd ceylon3D-main
npm run setup:all   # Installs all frontend dependencies
```

### 2. Start All (Dev Mode)
```sh
./scripts/start-dev.sh
# Or manually:
# Backend: cd backend && mvn spring-boot:run
# Landing: npm --prefix frontend/landing run dev -- --port 3000
# Shop:    npm --prefix frontend/shop run dev -- --port 5175
```

### 3. Build for Production
```sh
./scripts/build-all.sh
# Embeds frontend builds into backend static folder
```

## 🐳 Docker & Cloud Deployment

### Backend (Spring Boot)
- Build: `docker build -t ceylon3d-backend ./backend`
- Run:   `docker run -p 8080:8080 ceylon3d-backend`
- Or use `docker-compose up` in `backend/` (see `docker-compose.yml`)

### Frontend (Shop)
- Deploy to Vercel (see `vercel.json`)
- Set `VITE_API_BASE_URL` in Vercel project settings to your backend URL

### Environment Variables
- See `backend/README.md` for all required backend env vars (PostgreSQL, JWT, etc.)
- For production, never use local DB URLs or default secrets

## 🧪 Testing & Admin Scripts
- `clear-orders.js`: Node.js script to clear all orders (admin login required)
- `clear-orders.sql`: SQL script to reset order tables

## 📁 Notable Folders
- `backend/src/main/resources/static/`: Where frontend builds are embedded for full-stack deployment
- `frontend/landing/`: 3D printing homepage (see its README for details)
- `frontend/shop/`: E-commerce shop (see its README for deployment)
