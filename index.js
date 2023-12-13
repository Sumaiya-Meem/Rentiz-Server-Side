const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojnnavp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const userCollection = client.db("rentizDB").collection("users");
    const propertiesCollection = client.db("rentizDB").collection("properties");
    const reviewCollection = client.db("rentizDB").collection("reviews");
    const wishListCollection = client.db("rentizDB").collection("wish");

    // POST > User
    app.post('/users',async(req,res)=>{
        const user = req.body;
        const result =await userCollection.insertOne(user);
        res.send(result)
    })

    // GET > User
    app.get('/users',async(req,res)=>{
        const result =await userCollection.find().toArray();
        res.send(result);
    })

    // Delete user
    app.delete('/users/:id',async(req,res)=>{
        const id =req.params.id;
        const query={_id: new ObjectId(id)}

        const result =await userCollection.deleteOne(query);
        res.send(result);
    })

    // make admin
    app.patch('/users/admin/:id',async(req,res)=>{
        const id= req.params.id;
        const query={_id: new ObjectId(id)}
        const updateDoc ={
            $set:{
                role:'admin'
            }
        }
        const result = await userCollection.updateOne(query,updateDoc)
        res.send(result)
    })

     // make agent
     app.patch('/users/agent/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            role: 'agent'
          }
        };
        const result = await userCollection.updateOne(query, updateDoc);
        res.send(result);
      });

    // find user by email
  app.get('/users/:email', async (req, res) => {
    const userEmail = req.params.email;

    const result = await userCollection.findOne({ email: userEmail });
    res.send(result);
});


      // POST > Property
      app.post('/properties',async(req,res)=>{
        const user = req.body;
        const result =await propertiesCollection.insertOne(user);
        res.send(result)
    })
     // GET > property
     app.get('/properties',async(req,res)=>{
        const result =await propertiesCollection.find().toArray();
        res.send(result);
    })
    app.get('/properties/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)}
      const result =await propertiesCollection.findOne(query);
      res.send(result);
  })
    // 
    app.delete('/properties/:id',async(req,res)=>{
        const id =req.params.id;
        const query={_id: new ObjectId(id)}

        const result =await propertiesCollection.deleteOne(query);
        res.send(result);
    })

    // Update status
    app.put('/properties/verify/:id', async (req, res) => {
        const { id } = req.params;
        const query ={ _id: new ObjectId(id) }
          const result = await propertiesCollection.updateOne(
            query,{ $set: { status: 'verified' } }
          );
          res.send(result);
       
      });
      app.put('/properties/reject/:id', async (req, res) => {
        const { id } = req.params;
        const query ={ _id: new ObjectId(id) }
          const result = await propertiesCollection.updateOne(
            query,{ $set: { status: 'rejected' } }
          );
          res.send(result);
       
      });


      // Review section

      app.post('/reviews',async(req,res)=>{
        const review = req.body;
        const result =await reviewCollection.insertOne(review);
        res.send(result)
    })

    // wish list section
    app.post('/wish',async(req,res)=>{
      const wish = req.body;
      const result =await wishListCollection.insertOne(wish);
      res.send(result)
  })




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Rentiz Website is running .....')
  })
  
  app.listen(port, () => {
    console.log(`Rentiz Website  is running on port ${port}`)
  })