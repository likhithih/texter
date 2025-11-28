# Backend README

## Environment variables
- PORT: Port the server listens on. Default: 8001
- MONGO_URL: MongoDB connection string
- JWT_KEY: JWT secret key
- FRONTEND_URL: The deployed frontend origin(s) this server will accept for CORS. You can provide a single URL or multiple comma-separated URLs.

Example:

FRONTEND_URL=https://chatbox-xwqh.onrender.com

Multiple origins:

FRONTEND_URL=https://chatbox-xwqh.onrender.com,https://staging.example.com

Restart the server after changing env variables so they apply to new processes.
