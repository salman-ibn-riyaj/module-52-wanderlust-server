const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    
    await client.connect();

    const database = client.db("wanderlust");
    const destinationCollection = database.collection("destinations");
    const bookingCollection = database.collection('bookings');

    app.post('/bookings', async(req, res)=>{
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result)
    })

    app.get('/bookings/:userId', async(req, res)=>{
      const userId = req.params.userId;
      const result = await bookingCollection.find({userId:userId}).toArray();
      res.send(result);
    })
    app.delete('/bookings/:booking', async(req, res)=>{
      const bookingId = req.params.booking;
      const query = {_id: new ObjectId(bookingId)}
      const result = await bookingCollection.deleteOne(query)
      console.log(result, 'ekhan theke');
      res.send(result);
      
    })

    app.post('/destinations', async(req, res)=>{
        const destinationData = req.body;
        const result = await destinationCollection.insertOne(destinationData)
        res.send(result)
    })

    app.get('/destinations',async(req, res)=>{
        const result = await destinationCollection.find().toArray();
        res.send(result);

    })

    app.get('/destinations/:id', async(req, res)=>{

      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await destinationCollection.findOne(filter);
      res.send(result);

    })

    app.patch('/destinations/:id', async(req, res)=>{
      const updateDestinationData = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set:{
          ...updateDestinationData
        }
      }
      const result = await destinationCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    app.delete('/destinations/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await destinationCollection.deleteOne(filter);
      res.send(result);
    } )



  
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Salman shah");
});

app.listen(port, () => {
  console.log(`server is running successfully on port ${port}`);
});
