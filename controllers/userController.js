const bcrypt = require("bcrypt");
const User = require("../models/user");
const Sequelize = require("sequelize");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    console.log(req.body);

    const { username, email, password, phone } = req.body;

    // const transaction = Sequelize.Transaction();
    //  , transaction
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      res.status(409).json({ message: "User already exists, please login" });
    } else {
      console.log("************Adding user*************");
      let hashedPassword = await bcrypt.hash(password, 10);
      // {transaction}
      console.log(hashedPassword);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
      });
      console.log("User Signed Up");

      console.log(newUser);

      res
        .status(201)
        .json({ message: "User Registered Successfully", userId: newUser.id });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    console.log(existingUser);

    if (!existingUser)
      return res.status(404).json({ message: "User Doesn't Exist" });
    else if (!(await bcrypt.compare(password, existingUser.password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

    console.log(existingUser);

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({ token, username: existingUser.username });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.addMessage = async (req, res) => {
  const { message, token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user; //Then only req will have authorised user
      try {
        Message.create({
          body: message,
          userId: req.user.id,
        });
        res.status(201).json({ message: "Message Saved Successfully" });
      } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ message: "Error saving message" });
      }
    });
  } else {
    res.sendStatus(401);
  }
};


exports.getMessages = async (req,res) => {
try{
  const messages = await Message.findAll({
    include:[
      {
        model:User,
        attributes:['username'] // err attribute_s_
      },
    ],
  order: [
    ['createdAt','Asc'] 
  ],
});
//err format before sending
const formattedMessages = messages.map((message) => ({
  id: message.id,
  body: message.body,
  username: message.user.username, // Access the user's name
  createdAt: message.createdAt,
}));

console.log(formattedMessages);
return res.status(200).json({  messages: formattedMessages });
}
catch(err){
  console.error(err);
  res.status(500).json({ message: "Error fetching message" });
}
// const formattedMessages = messages.map(message => {
//   return `${message.username}: ${message.content}`
// })

// console.log(formattedMessages);
};

