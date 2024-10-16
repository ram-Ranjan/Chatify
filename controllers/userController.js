
const bcrypt = require('bcrypt')
const User = require('../models/user');
const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken');
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

exports.loginUser = async (req,res) => {
    try{
        const{email,password} =req.body;

        const existingUser =await User.findOne({where:{email}})
        console.log(existingUser);

        if(!existingUser)         
            return res.status(404).json({message:"User Doesn't Exist"});

        else if( !await bcrypt.compare(password,existingUser.password)){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

        console.log(existingUser);
       
        const token = jwt.sign(
            {
                id:existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_TOKEN_SECRET,
            {
                expiresIn:"1h"
            }
        );

       return res.json({token});
        

    }
    catch(error){
        console.error("Error",error);
        return res.status(500).json({error:"Server error"});

    }
};

