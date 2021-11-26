const express = require("express");
const route = require("./src/routers");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet')
const app = express();
dotenv.config({path : './config.env'});

app.use(express.json());
app.use(route);
app.use(helmet())
  
mongoose
  .connect(process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then((conn) => console.log('Database connected successfully...'))
  .catch((err) => console.log('Issue with database connection...', err))
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));