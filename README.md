# Lucy Player

A web repository application for watching episodes of "Świat według Kiepskich".

## Features

- Season-based episode organization
- Dark/Light mode toggle
- Random episode selection
- Responsive design
- Secure HTTPS video streaming

## Tech Stack

- Frontend: React.js, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lucy-player.git
```

2. Install dependencies
```bash
# Install server dependencies
cd lucy-player
npm install

# Install client dependencies
cd client
npm install
```

3. Create config.env in the server directory with:
```env
CONNECTION_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the development servers
```bash
# Start backend server
npm run server

# Start frontend (in another terminal)
cd client
npm start
```
### Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5000

### License
This project is licensed under the MIT License.
