const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycluster.rn7n6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
console.log(uri);

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("ProductDB").collection("products");

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      if (!result?.length) return res.send({ success: false, error: "No Data Found" });
      res.send({ success: true, data: result });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;
      console.log(product.name);
      if (!product.name || !product.price || !product.imgUrl) {
        return res.send({
          success: false,
          error: "Please Provide all Details",
        });
      }
      const result = await productsCollection.insertOne(product);
      res.send({
        success: true,
        message: `You Successfully added ${product.name}`,
      });
    });

    app.delete('/product/:id', async(req, res) => {
      const id = {_id: ObjectId(req.params.id)}
      const result = await productsCollection.deleteOne(id)
      res.send({success: true, message: `You have Deleted successfully`})
    })
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
