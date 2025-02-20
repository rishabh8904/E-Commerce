const Users=require('../models/userModel')
const jwt =require('jsonwebtoken')

const bcrypt=require('bcrypt')

const userCtrl={
    register:async(req,res)=>{
       try{
         const {name,email,password}=req.body;

         const user=await USers.findOne(email)
         if(user) res.status(400).json({msg:"Email already registered"})

         if(password.length<6) return res.status(400).json({msg:"Password should be at least 6 charachters long"})
         
        const passwordhash=await bcrypt.hash(password,10)
        const newUser = new USers ({
            name,email,password:passwordhash
        })
        await newUser.save()
         

        const accesstoken =createAccessToken({id:newUser._id})

        const refreshtoken =createRefreshToken({id:newUser._id})

        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:'/user/refresh_token'
        })

        res.json({msg:"Regitser Success"})
       }
       catch(err){
        return res.status(500).json({msg:err.message})
       }
    },
    refreshtoken: async(req,res)=>{
        try{
            const rf_token=req.cookies.refreshtoken;

        if(!rf_token) return res.status(400).json({msg:"please login or register"})
        
        jwt.verify(rf_token.process.env.REFRESH_TOKEN,(err,user)=>{
            if(err) return res.status(400).json({msg:"Please login or Register"})
            const accesstoken=createAccessToken({id:user.id})
        })
        res.json({rf_token})
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
        
    },
    login:async(req,res)=>{
        try{
            const {email,password}=req.body;
            const user=await Users.findOne({email})
            if(!user) return res.status(400).json({msg:"User does not exist"})
            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg:"Incorrect Password"})

            const accesstoken=createAccessToken({id:newUser.id})
            const refreshtoken=createRefreshToken({id:newUser.id})

            res.cookie('refreshtoken',refreshtoken,{
                httplOnly:true,
                path:'/user/refreshtoken'
            })
        
            
            
            res.json({accesstoken})
        }
        catch(arr){
            return res.status(500).json({msg:err.message})
        }
    },
    logout:async(req,res)=>{
        try{
            res.clearCookie('refreshtoken',{path:'/user/refreshtoken'})
            return res.json({msg:"Logged Out "})
        }
        catch(err){
          
        }
    },
    getUser:async(req,res)=>{
        try{
            const user=await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:"User not Found"})
            res.json(user)
        }
        catch(err){
            return res.status(500).json({msg:err.message})

        }
    }
}
const createAccessToken=(payload)=>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createRefreshToken=(payload)=>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN,{expiresIn:'7d'})
}
module.exports=userCtrl