# Password Manager (Frontend)

Frontend-first password manager UI built with Next.js App Router and Tailwind CSS.

## Pages

- Overview: Home dashboard
- Vault: List of entries
- Vault Entry: Detail view
- Create Entry: Modal-style create flow
- Edit Entry: Update credentials
- Vault Filters: Sidebar filter panel (wired)
- Vault Search: Quick tag chips (wired)
- Dashboard Stats: Home widgets
- Recent Activity: Timeline section
- Settings Notifications: Alert preferences
- Vault Health: Simple summary card
- Settings Account: Profile summary
- Settings Team: Basic members list
- Vault Folders: Simple group list
- Backend Status: Simple connection widget
- Live Entries: Create/list/update/delete
- Settings: Security policies and alerts
- Login: Auth UI

## Development

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 to view the UI.

## Simple Backend (Next.js API + MongoDB)

1) Copy env file:

```bash
cp .env.example .env
```

2) Update `MONGO_URI` if needed.

3) Set `JWT_SECRET` in `.env`.

3) Start the app:

```bash
npm run dev
```

The API runs on http://localhost:3000/api

## API Endpoints

- GET /api/health
- GET /api/entries
- POST /api/entries
- GET /api/entries?id=ENTRY_ID
- PUT /api/entries?id=ENTRY_ID
- DELETE /api/entries?id=ENTRY_ID

## Auth Endpoints

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

## Notes

- Frontend is connected to the backend health check on the Vault page.
