const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongoDB ..
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0kwdaj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carCollection = client.db("carDB").collection("carInfo");

    //toy add in to database
    app.post("/addToy", async (req, res) => {
      const body = req.body;
      const result = await carCollection.insertOne(body);
      console.log(result);
      res.send(result);
    });

    //Get all cars from database
    app.get("/allToys", async (req, res) => {
      const result = await carCollection.find({}).limit(20).toArray();
      res.send(result);
    });

    //get My Toys
    app.get("/myToys/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await carCollection
        .find({ seller_email: req.params.email })
        .toArray();
      res.send(result);
    });

    //get single data by id
    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };

      const options = {
        projection: { price: 1, quantity: 1, description: 1 },
      };

      const result = await carCollection.findOne(query, options);
      console.log(result);
      res.send(result);
    });



    //deleted single data from my toys
    app.delete("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

//testing server
app.get("/", (req, res) => {
  res.send("BABY CAR is running");
});

app.listen(port, () => {
  console.log(`baby car  server is running on port:${port}`);
});
