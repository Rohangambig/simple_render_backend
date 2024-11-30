const express =  require('express');
const cors =  require('cors');
const mongoose =  require('mongoose')
const User = require('./model/user');
require('dotenv').config(); 
const app = express()

const corsOptions = {
    origin: '*', // Allows requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true,  // Allows credentials (cookies, authorization headers, etc.)
  };
  
  // Apply CORS middleware globally
app.use(cors(corsOptions));
  
  
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Database connected successfully...')
}).catch(()=>{
    console.log("Error in database connection")
})

app.get('/home',(req,res)=>{
    res.send('welcome to home page')
})

app.post('/login',async (req,res) =>{
    const {email,password} = req.body;

    try {
    
        const user = await User.findOne({email});
        
        if(!user) return res.status(402).json({message:"Error in login..."});
        console.log(user.password)
        if(user.password !== password)
            return res.status(401).json({message:"invalid password"})
        return res.status(200).json({message:"login successfully done..."})
        
    }catch(err) {
        return res.status(403).json({});
    }
})

app.post('/signup',async (req,res)=> {
    const {name,email,password} = req.body;
    console.log(name,email,password)

    try {
        const user = new User({ name,email,password })
        await user.save();
        return res.status(200).json({message:"data stored successfully.."})

    }catch(err) {
        console.log('error in storing the data...');
        res.status(403).json({message:"error in stroing users data..."})
    }
})


app.listen(5001,()=>{
    console.log('server listening 5001....')
})
