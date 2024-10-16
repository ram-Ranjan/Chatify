require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database')
const path = require('path')

const app = express();
const cors = require('cors')

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://10.20.20.153:5500', 'http://localhost:5500'];  // Add multiple origins
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true
}));

app.options('*', cors());


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





