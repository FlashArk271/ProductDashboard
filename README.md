
  # Seller Admin Product Management

  This is a code bundle for Seller Admin Product Management. The original project is available at https://www.figma.com/design/viuNKovhWXagtSHa57UuZ9/Seller-Admin-Product-Management.

  ## Architecture

  - **Frontend**: React + Vite + TypeScript
  - **Backend**: Node.js + Express
  - **Database**: MongoDB Atlas

  ## Running the Application

  ### 1. Backend Server (MongoDB Atlas)

  ```bash
  cd server
  cp .env.example .env
  # Edit .env with your MongoDB Atlas connection string
  npm install
  npm run dev
  ```

  The server will start on http://localhost:3001

  ### 2. Frontend

  ```bash
  npm install
  npm run dev
  ```

  The frontend will start on http://localhost:5173

  ## MongoDB Atlas Setup

  1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a new cluster
  3. Create a database user
  4. Whitelist your IP address
  5. Get the connection string and add it to `server/.env`

  See [server/README.md](server/README.md) for detailed backend documentation.
  