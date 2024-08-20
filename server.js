require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database')
const path = require('path')

const app = express();
const cors = require('cors')

app.use(cors());


app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/user',userRoutes);


sequelize
.sync({alter:true})
.then(() => {
    app.listen(3000,'localhost',() => {
        console.log('Listening to port 3000')
    });
})
.catch(err => console.log(err));





