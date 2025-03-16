const express = require('express')
// console.log(express())
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bsuta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {

    const marathonsCollection = client.db("marathonDB").collection('marathons')
    const appliesCollection = client.db("marathonDB").collection('applies')

    // marathons api 

    // marathon post api 
    app.post("/add-marathons", async (req, res) => {
      const newMarathon = req.body
      // console.log(newJob)
      const result = await marathonsCollection.insertOne(newMarathon)
      res.send(result)
    })
    // get all marathons api 
    app.get('/marathons', async (req, res) => {
      const cursor = marathonsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // get 6 marathon limit aapi 
    app.get('/limit-marathons', async (req, res) => {
      const cursor = marathonsCollection.find()
      const result = await cursor.limit(6).toArray()
      res.send(result)
    })
    // get single marathon data api 
    app.get('/marathon/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await marathonsCollection.findOne(query)
      res.send(result)
    })
    // get email based my marathons list 
    app.get('/marathons/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await marathonsCollection.find(query).toArray()
      res.send(result)
    })
    // marathons delete api 
    app.delete('/marathon/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await marathonsCollection.deleteOne(query)
      res.send(result);
    })
    // update marathon data api 
    app.put('/update-marathon/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id)
      }
      const options = { upsert: true }
      const updatedMarathon = req.body;
      const marathon = {
        $set: updatedMarathon
      }
      const result = await marathonsCollection.updateOne(filter, marathon, options)
      res.send(result)
    })

    // my apply api
    app.post('/apply', async (req, res) => {
      const newApply = req.body
      const result = await appliesCollection.insertOne(newApply)

      const filter = { _id: new ObjectId(newApply.marathonId) }
      const update = {
        $inc: { registration_count: 1 },
      }
      const updateRegisterCount = await marathonsCollection.updateOne(filter, update)
      res.send(result)
    })
    app.get('/apply/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await appliesCollection.findOne(query)
      res.send(result)
    })
    app.get('/applies/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }

      const result = await appliesCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/apply/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await appliesCollection.deleteOne(query)
      res.send(result)
    })
    app.put('/update-apply/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id)
      }
      const options = { upsert: true }
      const updatedData = req.body;
      const apply = {
        $set: updatedData,
      }
      const result = await appliesCollection.updateOne(filter, apply, options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from Marathon Managment Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
