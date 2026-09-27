# Smart Edu-Hub notification worker

Install and authenticate Wrangler, then run these commands from this folder:

```bash
npm install -g wrangler
wrangler login
wrangler secret put ONESIGNAL_REST_API_KEY
wrangler deploy
```

After deployment, copy the Worker URL into the frontend `.env` file:

```env
VITE_NOTIFICATION_WORKER_URL=https://smart-edu-hub-notifications.<your-subdomain>.workers.dev
```

The Worker is only prepared for sending. It is not connected to bookings,
games, or course status changes yet.