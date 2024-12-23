const { MongoClient } = require("mongodb");
require("dotenv").config({ path: process.env.NODE_ENV === 'production' ? '.env' : './config.env' });

const connectionString = process.env.CONNECTION_URI;
const client = new MongoClient(connectionString, {
  ssl: true,
  tls: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
  }
});

let dbConnection;

module.exports = {
  connectToServer: async function () {
      try {
          console.log("Attempting to connect to MongoDB...");
          await client.connect();
          dbConnection = client.db(process.env.DB_NAME || "your_database_name");
          console.log("Successfully connected to MongoDB.");
          return dbConnection;
      } catch (err) {
          console.error("Error connecting to MongoDB:", err);
          throw err;
      }
  },

  getDb: function () {
      return dbConnection;
  },
};