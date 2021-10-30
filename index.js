const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l82nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()
        const database = client.db('services');
        const userCollection = database.collection('service');
        const myOderCollection = database.collection('oder')

        // GET API
        app.get('/services', async (req, res) => {
            const result = await userCollection.find({}).toArray()
            res.json(result);
        })


        // GET SINGLE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const user = { _id: ObjectId(id) };
            const result = await userCollection.findOne(user)
            res.json(result)
        })
        // MY ODER POST API
        app.post('/oder/:email', async (req, res) => {
            const result = await myOderCollection.insertOne(req.body)
            res.json(result)
            console.log(req.body)
        })
        // MY ODER GET API
        app.get('/oder/:email', async (req, res) => {
            const email = req.params.email;
            const find = {email:email}
            const result = await myOderCollection.find(find).toArray();
            res.json(result)
            
        })
         // MY ODER UPDATE API
        app.put('/oders/:id', async (req, res) => {
            const id = req.params.id;
            const user = { _id: ObjectId(id) }
            const updateItem = req.body;
            console.log(req.body)
            const options = { upsert: true };
             const updateDoc = {
            $set: {
                    address: updateItem.address,
                    number: updateItem.number,
                    email: updateItem.email,
            },
            };
            const result = await myOderCollection.updateOne(user, updateDoc, options)
            res.json(result)
        })
        // 
        app.get('/oders/:id', async (req, res) => {
            const id = req.params.id;
            const user = { _id: ObjectId(id) }
            const result = await myOderCollection.findOne(user)
            res.json(result)
        })
        // MY ODER DELETE API
        app.delete('/oder/:id', async (req, res) => {
            const id = req.params.id;
            const myid = { _id: ObjectId(id) }
            const result = await myOderCollection.deleteOne(myid)
            res.json(result)
        })
       

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await userCollection.insertOne(service)
            res.json(result);
            console.log(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('server runing')
});

app.listen(port, () => {
    console.log('listening on port',port)
})