const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5jjbyfi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("classic-mobile").collection("user");
    const productCollection = client.db("classic-mobile").collection("product");

    // User
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.put("/user", async (req, res) => {
      const email = req.body.email;
      const data = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          email: data.email,
          role: data.role,
          photoUrl: data.photoUrl,
          verify: data.verify,
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

   
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("doctors portal server is running");
});

app.listen(port, () => {
  console.log("Port is running");
});
