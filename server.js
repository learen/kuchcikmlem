const express = require('express');  //init express var
const connectDB = require('./config/db') //init DB var

const app = express();

//Connect DB

connectDB();

// Init Middleware

app.use(express.json({extended: false}))

app.get('/', (req,res) => res.json({msg: 'Witaj w aplikacji Kuchcik Mlem !'}))

//Define Routes

app.use('/api/users', require('./routes/users'));  //routes for catalogs to api
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));