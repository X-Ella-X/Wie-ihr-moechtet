import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MongoClient } from 'mongodb';

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGO || "mongodb://localhost:27017";

const app = express();
const client = new MongoClient(URI);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hallo")
});

app.post("/", (req, res) => {
  res.send(req.body);
});

app.get("/mongo", async (req, res) => {
  try {
    await client.connect();
    const dbName = "test";
    const collName = "animals";
    const animals = client.db(dbName).collection(collName);
    const result = await animals.find().toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({
      errorName: err.name,
      errorMessage: err.message
    });
  } finally {
    client.close();
  }
});

app.post("/mongo", async (req, res) => {
  try {
    await client.connect();
    const dbName = "test";
    const collName = "animals";
    const animals = client.db(dbName).collection(collName);
    const result = await animals.insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      errorName: err.name,
      errorMessage: err.message
    });
  } finally {
    client.close();
  }
});

app.listen(PORT, () => {
  console.log("Server listening on Port " + PORT);
});