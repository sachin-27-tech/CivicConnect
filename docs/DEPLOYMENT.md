# CivicConnect Deployment Guide

This project supports two deployment styles:

- Recommended: Vercel frontend and Render backend
- Optional: single-service Node deployment

For the recommended split deployment, see [VERCEL_RENDER_DEPLOYMENT.md](VERCEL_RENDER_DEPLOYMENT.md).

Single-service deployment works like this:

- React builds into `client/dist`
- Express starts from `server/server.js`
- Express serves the React build in production
- API routes remain available under `/api`
- Uploaded files are served from `/uploads`

## Required Environment Variables

Set these in your hosting platform:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civicconnect
JWT_SECRET=use_a_long_random_secret
```

Optional:

```env
PORT=5000
CLIENT_URL=https://your-deployed-domain.com
```

If the frontend and backend are deployed together as one service, `CLIENT_URL` can be left blank.

## Production Commands

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Health check:

```http
GET /api/health
```

## Render Single-Service Option

This repository includes `render.yaml` for the recommended backend-only Render setup. For a single-service Render deployment, remove `rootDir: server` and use root-level commands:

1. Push the project to GitHub.
2. Create a new Render Web Service.
3. Use:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI`
   - `JWT_SECRET`

## Railway

1. Create a new Railway project from the repository.
2. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI`
   - `JWT_SECRET`
3. Railway should detect Node.js automatically.
4. Set start command to `npm start` if Railway asks.

## Heroku

This repository includes a `Procfile`.

```bash
heroku create civicconnect
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_long_random_secret
git push heroku main
```

## Important Upload Note

Images are stored in `server/uploads`. This is correct for a college demonstration and simple VPS deployments.

On free cloud platforms with ephemeral filesystems, uploaded images may disappear after restarts. For a production business system, replace local storage with persistent object storage. This project intentionally avoids third-party storage to keep the minor-project scope simple.
