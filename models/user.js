const mongoose=require("mongoose")
const  {isEmail, isLowercase}=require("validator")
const bcrypt=require("bcrypt")

const user_schema=new mongoose.Schema(
    {
        email:{
            unique:true,
            required:[true,"please enter a email"],
            type:String,
            validate:[isEmail,"please enter a valid email"],
            lowercase:true
        },
        password:{
            type:String,
            minlength:[6,"password must be atleast 6 character long"],
            required:[true,"please enter a password"]
        },
        verification_token:{
            type:String,
            required:[true,"verification token not generated"]
        },
        token_expire:{
            type:Date,
            // required:[true,"verification token not generated"]
        },
        resettoken:{
            type:String
        },

        Passwordverify :{
            type:Boolean
        },

        //payment mathods
        stripecustomerid:{
            type:String
        },

        subscriptionstatus:{
            type:String
        },

        subscriptionid:{
            type:String
        },
   
         
    
        
    
    }
)


user_schema.pre("save",async function(){
    const salt=await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)

})

const user=mongoose.model("user",user_schema)
module.exports=user







