const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://mongobd2454:NVkFUTyJfmb9Nnnp@cluster0.l82nz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()
        const database = client.db('services');
        const userCollection = database.collection('service')

        // GET API
        app.get('/services', async (req, res) => {
            const result = await userCollection.find({}).toArray()
            res.json(result);
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