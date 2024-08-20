
const bcrypt = require('bcrypt')
const User = require('../models/user');
const Sequelize = require('sequelize')

exports.registerUser = async (req,res) => {


    try{

        console.log(req.body);

        const {username,email,password,phone}=req.body;

       // const transaction = Sequelize.Transaction();
   //  , transaction
       const existingUser =await  User.findOne({where:{email:email}} );

       if(existingUser){
        res.status(409).json({message:'User already exists, please login'});
       }else{

        console.log('************Adding user*************')
        let hashedPassword =await bcrypt.hash(password,10)
      // {transaction}
        console.log(hashedPassword)
       const newUser = await User.create(
            {username,
                email,
                password:hashedPassword,
                phone}
     );
     console.log("User Signed Up");

     console.log(newUser)

            res.status(201).json({message:'User Registered Successfully',userId:newUser.id});

       }
           
    }
    catch(error){
        console.error("Error in registerUser:", error);
        res.status(500).json({message:'What the f is wrong .....Internal Server Error'})
    }
     
}

