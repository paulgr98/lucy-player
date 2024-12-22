const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const https = require('https');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');


require("dotenv").config({ path: "./config.env" });

const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:3000', 'http://localhost', 'https://localhost', 'http://localhost:5000', 'https://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
    },
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_URI
    }),
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
app.use(require("./routes/episode"));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// SSL certificate options
const options = {
    key: fs.readFileSync('certs/private.key'),
    cert: fs.readFileSync('certs/certificate.crt')
};

// Get MongoDB driver connection
const dbo = require("./db/conn");

// Create HTTPS server on 443
https.createServer(options, app).listen(443, () => {
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log('HTTPS Server running on port 443');
});

// HTTP server on 80 that redirects to HTTPS
const httpApp = express();
httpApp.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
});

httpApp.listen(80, () => {
    console.log('HTTP Server running on port 80 (redirecting to HTTPS)');
});
