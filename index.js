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
    const categoryCollection = client
      .db("classic-mobile")
      .collection("Category");

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

    // http://localhost:500/user
    app.get("/user", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email };
      const seller = await userCollection.findOne(query);
      // console.log(seller);
      res.send({ role: seller?.role === "Seller" });
    });

    // Category

    // http://localhost:500/brand?Brand=Nokia

    // app.get("/brand", async (req, res) => {
    //   const Brand = req.query.Brand;
    // console.log(Brand);
    //   const query = { Brand };
    //   const result = await productCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get("/brand/:name", async (req, res) => {
      const category = req.params.name;
      // console.log(category);
      const query = { Brand: category };
      const result = await productCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    // Category

    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    // Product

    app.post("/products", async (req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const users = await productCollection.find(query).toArray();
      res.send(users);
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
