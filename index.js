const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const bookedProductCollection = client
      .db("classic-mobile")
      .collection("booked");

    /* User */
    // Post a User
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Update a User
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

    // Get All User
    // http://localhost:500/user
    app.get("/user", async (req, res) => {
      const query = {};
      const users = await userCollection.find(query).toArray();
      console.log(users);
      res.send(users);
    });

    // Get User Role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email };
      const seller = await userCollection.findOne(query);
      // console.log(seller);
      res.send({ role: seller?.role === "Seller" });
    });

    // Get Admin Role
    app.get("/adminUsers/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email };
      const seller = await userCollection.findOne(query);
      // console.log(seller);
      res.send({ role: seller?.role === "Admin" });
    });
    // delete a user
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    /* Category */

    // http://localhost:500/brand?Brand=Nokia

    // app.get("/brand", async (req, res) => {
    //   const Brand = req.query.Brand;
    // console.log(Brand);
    //   const query = { Brand };
    //   const result = await productCollection.find(query).toArray();
    //   res.send(result);
    // });

    // Get a brand collection
    app.get("/brand/:name", async (req, res) => {
      const category = req.params.name;
      // console.log(category);
      const query = { Brand: category };
      const result = await productCollection.find(query).toArray();
      // console.log(result);
      res.send(result);
    });

    // get All Category
    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    /* Product */
    // Post a product
    app.post("/products", async (req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // Get All Product
    app.get("/products", async (req, res) => {
      const query = {};
      const users = await productCollection.find(query).toArray();
      res.send(users);
    });

    // get my Product
    // app.get("/dashboard/myProduct", async (req, res) => {
    //   const email = req.query.email;
    //   console.log(email);
    //   const query = { email };
    //   const result = await productCollection.find(query).toArray();
    //   res.send(result);
    // });

    // Get My product
    // http://localhost:5000/dashboard/myProduct?email=razibulislam665@gmail.com
    app.get("/dashboard/myProduct", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      console.log(query);
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    // app.delete("/products/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await productCollection.deleteOne(query);
    //   res.send(service);
    // });

    // Delete a product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // Add Booked Product
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await bookedProductCollection.insertOne(product);
      res.send(result);
    });

    /* My Orders */
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookedProductCollection.find(query).toArray();
      res.send(bookings);
    });

    /*Advertise Put*/
    app.put('/advertise', async (req, res) => {
      
    })
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
