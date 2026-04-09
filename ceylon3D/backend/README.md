# ITP E-commerce (Backend)

This is a scaffolded Spring Boot + Maven backend for the ITP E-commerce project.

Features:
- Spring Boot 3.x
- Java 17
- JWT authentication skeleton
- PostgreSQL (Supabase compatible)
- Basic folder structure (controllers, services, repos, models, dto)

To run locally:
1. Set environment variables (see `.env.example`)
2. Build app: `./mvnw package` or `mvn package`
3. Run: `java -jar target/itp-ecommerce-0.0.1-SNAPSHOT.jar`

Production deployment notes:
- Do not use local database URLs (`localhost`) in production.
- Set PostgreSQL env vars in your backend host:
	- `SUPABASE_DB_HOST` (example: `db.jgainmkjmzqjmqvsniqw.supabase.co`)
	- `SUPABASE_DB_PORT` (example: `5432`)
	- `SUPABASE_DB_NAME` (example: `postgres`)
	- `SUPABASE_DB_USER` (example: `postgres`)
	- `SUPABASE_DB_PASSWORD` (your Supabase database password)
	- Optional overrides:
		- `SPRING_DATASOURCE_URL`
		- `SPRING_DATASOURCE_USERNAME`
		- `SPRING_DATASOURCE_PASSWORD`
		- `SPRING_JPA_HIBERNATE_DDL_AUTO` (default: `update`)
- Set auth env vars:
	- `JWT_SECRET`
	- `JWT_EXPIRATIONMS`
- Optional: set `SPRING_PROFILES_ACTIVE=prod` if you want to use `application-prod.yml`.
- Ensure your frontend (`VITE_API_BASE_URL`) points to this deployed backend URL, not localhost.

Static frontend: place your home page HTML/CSS/JS in `src/main/resources/static/` — `index.html` will be served at `http://localhost:8080/`.

Sample endpoints (Postman):
- POST `/api/auth/register` {email,password,fullName}
- POST `/api/auth/login` {email,password}
- GET `/api/products` — public
- POST `/api/products` — admin (requires Bearer token)
- GET `/api/cart` — authenticated
- POST `/api/orders` — place order

Notes:
- Default seeded admin: `admin@itp.edu` / `adminpass`
- Update `jwt.secret` in `src/main/resources/application.yml` before production
- For local dev you can leave CORS open (configured for `*`) but lock origins for production