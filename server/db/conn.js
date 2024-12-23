const { MongoClient } = require("mongodb");
require("dotenv").config({ path: process.env.NODE_ENV === 'production' ? '.env' : './config.env' });

const connectionString = process.env.CONNECTION_URI;
const client = new MongoClient(connectionString);

let dbConnection;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      dbConnection = client.db("lucy");
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