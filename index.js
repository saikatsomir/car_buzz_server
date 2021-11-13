const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const app = express()

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hb6l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run () {
    try{

        await client.connect()
        const database = client.db('car_egency')
        const productCollection = database.collection('products')
        const usersCollection = database.collection('users')
        const appoinmentsCollection = database.collection('appoinments')
        const reviewCollection = database.collection('review')


        // GET PRODUCTS API
        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({})
            const product = await cursor.toArray()
            res.send(product)
        })

        // GET APPOINMETN API
        app.get('/appoinments', async(req, res) => {
            const cursor = appoinmentsCollection.find({})
            const product = await cursor.toArray()
            res.send(product)
        })

        //GET REVIEW API
        app.get('/review', async(req, res) => {
            const cursor = reviewCollection.find({})
            const review = await cursor.toArray()
            res.send(review)
        })

        // GET SINGLE PRODUCTS DETAIL
        app.get('/Products/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const detail = await productCollection.findOne(query)
          res.json(detail)
        })

        // POST USERS DATA
        app.post('/users', async (req, res) => {
          const users = req.body;
          const result = await usersCollection.insertOne(users)
          console.log(result)
          res.json(result)
        })

        //POST PRODUCTS DATA
        app.post('/Products', async (req, res) => {
          const products = req.body;
          const result = await productCollection.insertOne(products)
          res.json(result)
        })

        // POST APPOINMENTS DATA
        app.post('/appoinments', async (req, res) => {
          const appoinment = req.body;
          const result = await appoinmentsCollection.insertOne(appoinment)
          res.json(result)
        })

        //GET A SINGLE USER DTAT
        app.get('/users/:email', async(req, res) =>{
          const email = req.params.email;
          const query = {email: email}
          const user = await usersCollection.findOne(query)
          let isAdmin = false
          if(user?.role === "admin"){
            isAdmin = true
          }
          res.json({admin: isAdmin})
        })

        //MAKE USER ADMIN
        app.put('/users/admin', async (req, res) => {
          const users = req.body;
          console.log('put', users.email);
              const filter = {email: users.email};
               const updateDoc = {$set: {role: 'admin'}};
              const result = await usersCollection.updateOne(filter, updateDoc);
              res.json(result)
        })

        //SHIPPED ORDER
        app.put('/appoinments/shifted', async (req, res) => {
          const users = req.body;
          console.log('put', users.email);
              const filter = {email: users.email};
               const updateDoc = {$set: {shipping: 'Hey You Are Success. Your Product has been Shifted'}};
              const result = await appoinmentsCollection.updateOne(filter, updateDoc);
              res.json(result)
        })

        // POST REVIEW DATA
        app.post('/review', async (req, res) => {
          const review = req.body;
          const result = await reviewCollection.insertOne(review)
          res.json(result)
        })

        // DELETE APPOINMENTS SINGLE DATA
        app.delete('/appoinments/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const result = await appoinmentsCollection.deleteOne(query)
          res.json(result)
        })

        // DELETE PRODUCTS SINGLE DATA
        app.delete('/Products/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)}
          const result = await productCollection.deleteOne(query)
          res.json(result)
        })

    }
    finally{
    // await client.close()
    }
}

run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})