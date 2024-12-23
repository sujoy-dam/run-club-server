const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@main.yolij.mongodb.net/?retryWrites=true&w=majority&appName=Main`
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
    
    // marathons api 
    app.post("/add-marathons", async (req, res) => {
      const newMarathon = req.body
      // console.log(newJob)
      const result = await marathonsCollection.insertOne(newMarathon)
      res.send(result)
    })
    app.get('/marathons', async (req, res) => {
      const cursor = marathonsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
  })
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
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
