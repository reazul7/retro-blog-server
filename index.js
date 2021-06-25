const express = require('express')
const app = express()

require('dotenv').config()
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME)

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port) 