var express = require('express')

const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const port=5000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skxzv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

console.log(process.env.DB_USER)

var app = express()
app.use(bodyParser.json());
app.use(cors());

client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const productsCollection = client.db("emaJhonStore").collection("orders");
  console.log('database connected');
  app.post('/addProduct',(req,res) => {
      const products =req.body;    
      productsCollection .insertOne(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })
  
});

app.get('/products',(req, res)=>{
    productsCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents);
    })
})

app.get('/products/:key',(req, res)=>{
    productsCollection.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })
})

app.post('/productsByKeys',(req, res)=>{
    const productKeys = req.body;
    productsCollection.find({key:{$in: productKeys}})
    .toArray((err,documents)=>{
        res.send(documents);
    })
})

app.post('/addOrder',(req,res) => {
    const products =req.body;    
    productsCollection .insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
})

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT||  port)