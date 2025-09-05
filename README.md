# Artify

Artify is a real-time auction platform for art collectibles, inspired by Artsy.net. This project is built with a modern tech stack and designed for seamless user experience, robust authentication, and real-time bidding.

## Features

- **User Authentication**: Register, login, and secure JWT-based sessions
- **Real-Time Auction**: Bid on art items with live updates using Socket.IO
- **Artsy-Inspired UI**: Responsive, elegant design with carousel, dashboard, and curated picks
- **Notifications**: Centralized notification system for success, error, and bid events
- **Currency Localization**: All prices displayed in Indonesian Rupiah (IDR)
- **Admin Dashboard**: View auction stats and manage items (future feature)
- **AI Insights**: Gemini-powered analysis for item value and bidding strategy

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, SweetAlert2, Animate.css, Axios, Socket.IO Client
- **Backend**: Express, Sequelize, PostgreSQL, Socket.IO, JWT, bcryptjs
- **AI Integration**: Google Gemini API
- **Deployment**: PM2, AWS EC2, Nginx (recommended for production)

## Folder Structure

```
artify-app/
├── client/      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   ├── public/
│   └── ...
├── server/      # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── bin/
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/artify-io.git
   cd artify-app
   ```
2. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. **Configure environment variables**

   - Copy `.env.example` to `.env` in both `client` and `server` folders
   - Fill in your database, JWT, and API keys

4. **Setup database**
   ```bash
   cd server
   npm run db:setup
   ```

### Running Locally

- **Backend**
  ```bash
  cd server
  npm run dev
  ```
- **Frontend**
  ```bash
  cd client
  npm run dev
  ```
- Access the app at `http://localhost:5173` (or the port shown in terminal)

### Production Deployment

- Use PM2 and Nginx for production
- Example PM2 config: `ecosystem.config.js`
- Set `PORT=80` in production environment
- Update `VITE_API_URL` in client `.env.production` to your server domain

## API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/items` — List all auction items
- `GET /api/items/:id` — Get item details
- `POST /api/bids` — Place a bid
- `GET /api/bids/:itemId` — Get bid history for item
- `POST /api/ai/why-worth-it` — AI item analysis
- `POST /api/ai/price-prediction` — AI price prediction
- `POST /api/ai/bidding-strategy` — AI bidding strategy

## Environment Variables

**Server**

```
NODE_ENV=production
PORT=80
DB_HOST=localhost
DB_NAME=artify_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Client**

```
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## License

MIT

## Credits

Developed with ❤️ by Artify team.
