# Deploy CivicConnect With Vercel Frontend and Render Backend

This is the recommended split deployment setup:

- Frontend: Vercel, using the `client` folder
- Backend: Render, using the `server` folder
- Database: MongoDB Atlas

## 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow network access from `0.0.0.0/0` for a college demo, or restrict it for production.
4. Copy the connection string.

Use a database name such as `civicconnect`:

```text
mongodb+srv://username:password@cluster.mongodb.net/civicconnect
```

## 2. Deploy Backend On Render

Render settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civicconnect
JWT_SECRET=use_a_long_random_secret
CLIENT_URL=https://your-vercel-frontend.vercel.app
```

After deployment, test:

```http
https://your-render-backend.onrender.com/api/health
https://your-render-backend.onrender.com/api/reports
```

Both should return a successful response. `/api/reports` should return an array.

## 3. Deploy Frontend On Vercel

Vercel settings:

```text
Root Directory: client
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Environment variables:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_SERVER_URL=https://your-render-backend.onrender.com
```

Deploy the frontend.

## 4. Update Render CORS

After Vercel gives you the final frontend URL, go back to Render and set:

```env
CLIENT_URL=https://your-vercel-frontend.vercel.app
```

Redeploy the Render service.

For multiple allowed frontend URLs, use commas:

```env
CLIENT_URL=http://localhost:5173,https://your-vercel-frontend.vercel.app
```

## 5. Local Development

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/civicconnect
JWT_SECRET=civicconnect_local_development_secret_change_before_deployment
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=/api
VITE_SERVER_URL=
```

Run locally:

```bash
npm install
npm run dev
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend: http://localhost:5000
Health: http://localhost:5000/api/health
Reports through Vite proxy: http://localhost:5173/api/reports
```

## 6. Upload Storage Note

This project uses local storage in `server/uploads`.

That is fine for a college demo and simple Render testing, but Render free instances use an ephemeral filesystem. Uploaded files may not persist forever. For a real production product, use cloud storage such as S3, Cloudinary, or Firebase Storage.
