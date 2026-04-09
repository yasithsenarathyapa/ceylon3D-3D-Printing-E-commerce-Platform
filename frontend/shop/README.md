
  # E-commerce site for 3D printing

  This is a code bundle for E-commerce site for 3D printing. The original project is available at https://www.figma.com/design/gToz42E8dehKsbzsmhpHHA/E-commerce-site-for-3D-printing.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    ## Deploying (Vercel + Backend API)

    This frontend can be deployed on Vercel, but your Spring Boot backend and database must run on a separate hosting provider.

    1. Deploy backend to Render, Railway, Fly.io, or another Java host.
    2. Use a cloud database (Neon/Supabase/PlanetScale/Aiven/Railway MySQL/Postgres).
    3. In Vercel Project Settings -> Environment Variables, set:
      - `VITE_API_BASE_URL=https://your-backend-domain.com/api`
    4. Redeploy frontend after adding env vars.

    If `VITE_API_BASE_URL` is missing in production, the app falls back to `/api`, which only works if an API is hosted on the same domain.
  