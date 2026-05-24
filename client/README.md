# CivicConnect Frontend

React frontend for CivicConnect.

## Vercel Settings

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Environment Variables

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_SERVER_URL=https://your-render-backend.onrender.com
```

For local development, the app can use `/api` because Vite proxies API requests to `http://localhost:5000`.
