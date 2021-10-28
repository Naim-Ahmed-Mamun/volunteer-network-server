const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 7000;

// middleware
app.use(cors());
app.use(express.json());

// DATABASE CONNECT
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h3xh8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('Volunteer_Network');
        const eventCollection = database.collection('Events');
        const volunteerUserBookCollection = database.collection('userBookInfo')

        // GET API
        app.get('/events',async(req,res) => {
            const cursor = eventCollection.find({})
            const events = await cursor.toArray();
            res.send(events)
        })
        // GET SINGLE DATA
        app.get('/events/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await eventCollection.findOne(query);
            console.log(result);
            res.json(result)
        })
         // GET USER BOOK API
         app.get('/userBook',async(req,res) => {
            const cursor = volunteerUserBookCollection.find({});
            const result = await cursor.toArray();
            console.log(result);
            res.json(result)
        })
        // GET USER BOOK DATA
        app.get('/userBook',async(req,res) => {
            const email = req.query.email;
            const query = {email:email}
            const cursor = volunteerUserBookCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.json(result)
        }) 
        // POST API
        app.post('/events',async(req,res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result)
        });
        // ANOTHER POST
        app.post('/userBook',async(req,res) => {
            const userBookInfo = req.body;
            const result = await volunteerUserBookCollection.insertOne(userBookInfo);
            console.log(userBookInfo,result);
            res.json(result)
        });
        // DELETE POST
        app.delete('/userBook/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await volunteerUserBookCollection.deleteOne(query);
            res.json(result)
        })
       
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

// test server running
app.get('/',(req,res) => {
    res.send('Volunteer network server is running')
})

app.listen(process.env.PORT || port,() => {
    console.log('server is running',port);
})