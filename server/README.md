# CivicConnect API

Express API for CivicConnect.

## Render Settings

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

## Environment Variables

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civicconnect
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=https://your-vercel-frontend.vercel.app
```

Use comma-separated `CLIENT_URL` values if you need to allow multiple frontend origins.
