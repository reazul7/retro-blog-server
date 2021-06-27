const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectID } = require('mongodb');

const app = express()

require('dotenv').config()
const port = process.env.PORT || 5000;

// console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME)


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ae7d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const adminCollection = client.db(process.env.DB_NAME).collection("admin");
  const blogsCollection = client.db(process.env.DB_NAME).collection("blogs");
  // perform actions on the collection object
  console.log('Database connection established')
  // client.close();

  // make admin
  app.post('/makeAdmin', (req, res) => {
    const user = req.body;
    adminCollection.insertOne(user)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  // add blogs
  app.post('/addBlog', (req, res) => {
    const newBlog = req.body;
    console.log(newBlog)
    blogsCollection.insertOne(newBlog)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  // get blogs
  app.get('/blogs', (req, res) => {
    blogsCollection.find({})
    .toArray((err, items) => {
      res.send(items)
    })
  })

  // admin check
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, admins) => {
      res.send(admins.length > 0)
    })
  })

  // single blog post
  app.get('/blogDetails/:id', (req, res) => {
    blogsCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
      console.log(err,documents)
    })
  })
});


app.listen(port) 