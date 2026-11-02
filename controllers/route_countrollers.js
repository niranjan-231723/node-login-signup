const users=require("../models/user")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const bcrypt=require("bcrypt")
const {mail}=require("../verification/email_method")


module.exports.form=(req,res)=>{
    res.render("form")
}

const handleerror=(err)=>{
    console.log(err)
    const errors={email:"",password:""}
    if (err.code==11000){
           errors.email="mail is already registered"
    }
    
    if (err.errors &&  err.errors.email){
        errors.email="email is not valid"
    }

    if (err.errors && err.errors.password){
           errors.password="password must be atleat 6 char long"
    }
     
    return errors
        
    }


const maxage=3*24*60*60
const createtoken=(id)=>{
       return jwt.sign({id},"secrete",{expiresIn:maxage})
}


module.exports.signup= async (req,res)=>{
    try{
        const verification_token=crypto.randomBytes(32).toString("hex")
        const token_expire=Date.now()+24*60*60*1000

        const {email,password}=req.body
        const user=await users.create({email,password,verification_token,token_expire})
        console.log(user)
        const  token=createtoken(user.id);

        res.cookie("cookie",token,{
            httpOnly:true,
            maxAge:60*60*1000
        });

        res.status(201).json({user:"account created successfully"})

    }
    catch(err){
       const errors=handleerror(err)
       console.log(err)
       
       res.status(400).json(errors)
    }
}

module.exports.findemail=async (req,res)=>{

    const obj=req.body

    const fuser=await users.findOne({email:obj.email})
    
    if(fuser){
        if(await bcrypt.compare(obj.password,fuser.password)){
            return res.json({found:true})
        }
    
        else{
            return res.json({found:true,message:"incorrect password"})
            }
    }
    else{
        return res.json({found:false})
    }
}


module.exports.errorpage=async (req,res)=>{
    res.render("errorpage")
}

module.exports.login=async(req,res)=>{
    res.render("login")
}


module.exports.resetpassword=async (req,res)=>{

    console.log("reset function")
    const {email}=req.body
    const user=await users.findOne({email})
    console.log("user found")

    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    console.log("sending the mail")
    const token=createtoken(user.id)
    const verification_url=`http://localhost:5000/checkingvalidity/${token}`
    await mail(
            email,
            "create a new password",
            `<p> click here to  reset <a href="${verification_url}"> click here</a></p>`
        )

    res.json({message:"done"})
}



module.exports.checkingvalidity=async (req,res)=>{
    console.log("directing to reset page")
    res.render("hashresetpassword", { token: req.params.token })
}


module.exports.verification=async (req,res)=>{
    const token=req.body.token
    console.log("tokenrecer")
    console.log(token)
    const  user=await users.findOne({
        resettoken:token

    })
    console.log(user)
    if (user){
        res.status(201).json({isverified:true})
    }
    else{
        res.status(201).json({isverified:false})
    }
}

//reset password page

module.exports.resetpasswordpage=(req,res)=>{
    res.render("resetpasswordpage")
}


//reset hash password
module.exports.hashresetpassword=async(req,res)=>{
    const token=req.params.token
    const map=jwt.verify(token,"secrete")
    const user = await users.findById(map.id)

    if(!user){
        res.status(404).json({message:"user not found"})
    }
    else if(req.body.opassword==req.body.npassword){
        user.password=req.body.npassword
        user.save()
        res.redirect("/success")
    }

    return res.json({meaasge:"password updated"})

}

module.exports.signin=async (req,res)=>{
    console.log("here")
    const token=req.cookies?.cookie
    let autoemail=""

    //using the error handling token expiry is handled
    //jwt.verify throws (token expired or invalid)
    try{
    if(token){
    console.log(token)
    const map=jwt.verify(token,"secrete")
    const user= await users.findById(map.id)
    if(user){ autoemail=user.email}
    }
    }
    catch(e){
        console.log(e.message)
    }

    res.render("signin",{autoemail})

}

module.exports.success=(req,res)=>{
    res.render("success")
}



// if(user.password==req.body.password)

// const obj = { email: "a@x.com", password: "123456" }

// JSON.stringify(obj)
// // '{"email":"a@x.com","password":"123456"}'   <- now it's a string






