const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);

let db;

// Connect to MongoDB
client.connect().then(() => {
  db = client.db("transcriptions_db");
  console.log("Connected to MongoDB");
});

// Endpoint to get all transcription jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await db.collection("jobs").find().toArray();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Endpoint to get a specific transcription by job_id
app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await db.collection("jobs").findOne({ job_id: req.params.id });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});
