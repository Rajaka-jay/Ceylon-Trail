# Traveler accounts

Ceylon Trail traveler accounts use the backend API and PostgreSQL.

## API routes

- `POST /api/auth/register` — create an account with an email and password (8–128 characters).
- `POST /api/auth/user/login` — sign in and receive a one-day bearer token.
- `GET /api/auth/me` — return the signed-in traveler when sent as `Authorization: Bearer <token>`.

Passwords are hashed with bcrypt before storage. Admin sign-in remains separate at `POST /api/auth/login`.

## Deployment setup

1. Deploy `serendib-backend` as a Node.js service with a reachable HTTPS URL.
2. Configure its `DATABASE_URL` and a private `JWT_SECRET` in the backend host.
3. Apply the Prisma migration during deployment with `npx prisma migrate deploy`.
4. In the GitHub repository, add the Actions repository variable `VITE_API_URL` with the public API root ending in `/api`, for example `https://api.example.com/api`.
5. Run the GitHub Pages deployment workflow again so the frontend is built with the API address.

Do not put `JWT_SECRET` in the frontend or a GitHub Actions variable used by Vite. The Pages site cannot run the Express backend by itself.
