const express = require("express");
const axios = require("axios");
const cors = require("cors");
const redis = require("redis");
const app = express();

const DEFAULT_EXPIRATION = 3600;

const redisClient = redis.createClient();

// Connect to Redis
redisClient.connect().catch(console.error);

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

app.use(cors());

app.get("/photos", async (req, res) => {
  const albumId = req.query.albumId;
  
  try {
    const cachedData = await redisClient.get("photos");
    if (cachedData) {
      console.log("Cache HIT");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Cache MISS");
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos", {
      params: { albumId },
    });

    await redisClient.setEx("photos", DEFAULT_EXPIRATION, JSON.stringify(data));
    console.log(`Cached ${data.length} photos in Redis`);

    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

app.get("/photos/:id", async (req, res) => {
  const photoId = req.params.id;
  
  try {
    const cachedData = await redisClient.get(`photo:${photoId}`);
    if (cachedData) {
      console.log("Cache HIT");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Cache MISS");
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${photoId}`
    );

    await redisClient.setEx(`photo:${photoId}`, DEFAULT_EXPIRATION, JSON.stringify(data));
    console.log(`Cached photo ${photoId} in Redis`);

    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
