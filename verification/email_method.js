const nodemailer=require("nodemailer")

const transport=nodemailer.createTransport(
    {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  
    auth:{
    user:"niranjan.naik.freelancer@gmail.com",  //the mail using which i will be sending the mail
    pass:"twnm dsny amjm gymh",   //app password that i  have set
    },
    tls: {
    rejectUnauthorized: false
  }
    }
)


transport.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Gmail connection successful");
    }
});


module.exports.mail=async (to,subject,html)=>{
    await transport.sendMail(
        {   from:"niranjan.naik.freelancer@gmail.com",
            to,
            subject,
            html
        }
    )
}
