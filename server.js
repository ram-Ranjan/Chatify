require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database')
const path = require('path')

const app = express();
const cors = require('cors')

// app.use(cors({
//     origin: ['http://192.168.0.100:5500', 'http://localhost:5500','http://192.168.211.13:5500'],
//     credentials: true
// }));

// app.options('*', cors());
app.use(cors());



app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

const User = require('./models/user');
const Message = require('./models/message');

User.hasMany(Message,{ foreignKey: 'userId' });
Message.belongsTo(User,{ foreignKey: 'userId' });



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





