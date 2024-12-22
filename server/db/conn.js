const { MongoClient } = require("mongodb");
require('dotenv').config();

const connectionString = process.env.CONNECTION_URI;
const client = new MongoClient(connectionString);

let _db;

async function createIndexes() {
  try {
    const db = client.db("lucy");
    await db.collection("episodes").createIndex({ season: 1, episode: 1 });
    await db.collection("episodes").createIndex({ title: 1 });
    console.log("Indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      _db = client.db("lucy");
      await createIndexes();
      console.log("Successfully connected to MongoDB.");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  },

  getDb: function () {
    return _db;
  },
};