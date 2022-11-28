const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SCREET_KEY);
const port = process.env.PORT || 5000;

const app = express();

// console.log(typeof(stripe));

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
    // All Collections
    const userCollection = client.db("classic-mobile").collection("user");
    const productCollection = client.db("classic-mobile").collection("product");
    const categoryCollection = client
      .db("classic-mobile")
      .collection("Category");
    const bookedProductCollection = client
      .db("classic-mobile")
      .collection("booked");
    const reportProductCollection = client
      .db("classic-mobile")
      .collection("report");
    const paymentsCollection = client
      .db("classic-mobile")
      .collection("payments");

    const advertiseCollection = client
      .db("classic-mobile")
      .collection("advertise");

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
      // console.log(users);
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

    // Get User Verified
    app.put("/users/verify/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          verify: "true",
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Get Verified User Email
    app.get("/users/verify/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      console.log(filter);
      const result = await userCollection.findOne(filter);
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

    // Get seller or buyer
    app.get("/allUsers/:role", async (req, res) => {
      const role = req.params.role;
      const query = { role: role };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    // Get My product
    // http://localhost:5000/dashboard/myProduct?email=razibulislam665@gmail.com
    app.get("/dashboard/myProduct", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      // console.log(query);
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

    // Add Report Product
    app.post("/addReport", async (req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await reportProductCollection.insertOne(product);
      res.send(result);
    });

    // Get Report
    app.get("/allReport", async (req, res) => {
      const query = {};
      const result = await reportProductCollection.find(query).toArray();
      res.send(result);
    });

    // Delete A Report
    app.delete("/reports/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await reportProductCollection.deleteOne(query);
      res.send(result);
    });

    /* My Orders */
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookedProductCollection.find(query).toArray();
      res.send(bookings);
    });

    // Booking
    app.post("/orders", async (req, res) => {
      const order = req.body;
      // console.log(order);

      const query = {
        productId: order.productId,
        email: order.email,
      };

      const alreadyBooked = await bookingCollection.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already have a buy ${order.productName}`;
        return res.send({ acknowledged: false, message });
      }

      const result = await bookingCollection.insertOne(order);
      res.send(result);
    });

    // Payments Orders
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orders = await bookedProductCollection.findOne(query);
      res.send(orders);
    });

    // create-payment-intent
    app.post("/create-payment-intent", async (req, res) => {
      const orders = req.body;
      const price = orders.resalePrice;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    //payments
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);
      const id = payment.bookingId;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updatedResult = await bookedProductCollection.updateOne(
        filter,
        updatedDoc
      );
      res.send(result);
    });

    // Delete a Order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await bookedProductCollection.deleteOne(query);
      res.send(result);
    });

    // Advertise
    app.get("/myAdvertise/:advertise", async (req, res) => {
      const advertise = req.params.advertise;
      const query = { advertise: advertise };
      const data = await productCollection.find(query).toArray();
      res.send(data);
    });

    // Update advertise
    app.put("/myAdvertise/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          advertise: "true",
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Classic server is running");
});

app.listen(port, () => {
  console.log("Port is running");
});
