
const validate=require('../utils/validate')
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');


const register= async (req,res)=> {
    try {

          validate(req.body);
           const {firstName,emailId,password}=req.body;

             
           req.body.password=await bcrypt.hash(req.body.password,10);
           req.body.role='user';
          

          const user= await User.create(req.body);

            let token = jwt.sign({_id:user._id, emailId:emailId,role:'user' }, process.env.JWT_KEY ,{ expiresIn: '1h' });
            
            const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role:user.role,
    }
    
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).json({
        user:reply,
        message:"Loggin Successfully"
    })
          

    }
    catch (err) {
         res.status(400).send("Error"+err);
    }
}

const login= async (req,res)=> {

    try {
        const {emailId,password}=req.body;

        if(!emailId) {
            throw new Error("Invalid Credential");
        }
        if(!password) {
            throw new Error("Invalid Credential");
        }

        const user=await User.findOne({emailId});
        const match =bcrypt.compare(password,user.password);
        if(!match) {
            throw new Error("Invalid Credential");
        }
        

                const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })

    }
    catch(err) {
         res.status(400).send("Error"+err);
    }

}


const logout= async(req,res)=> {

    try {
              
        const {token}=req.cookies;

        const payload=jwt.decode(token);

        await redisClient.set(`token:${token}`);

        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("token", null, {
    expires: new Date(0),
    httpOnly: true
});
    
   res.send("Logout Successfully");
    }
    catch(err) {
       res.status(503).send("Error"+err.messsage);
    }
}


const adminRegister= async(req,res)=> {
          try {

          validate(req.body);
           const {firstName,emailId,password}=req.body;

             
           req.body.password=await bcrypt.hash(req.body.password,10);
        //    req.body.role='admin';
          

          const user= await User.create(req.body);

            let token = jwt.sign({_id:user._id, emailId:emailId,role:user.role }, process.env.JWT_KEY ,{ expiresIn: '1h' });

           res.cookie('token',token,{maxAge:60*60*1000});
           res.status(201).send("Admin Regitered Sucessfully");

    }
    catch (err) {
         res.status(400).send("Error"+err);
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}


module.exports={register,login,logout,adminRegister,deleteProfile};