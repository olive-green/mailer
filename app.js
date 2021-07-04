const express=require("express");
const app=express();
const nodemailer=require("nodemailer");
const bodyParser=require("body-parser");
const {google} =require("googleapis");
require("dotenv").config();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}));

//path detecting middleware
app.use((req,res,next)=>{
    console.log("Request Type: ",req.method," at : ",req.path);
    next();
})

app.get("/",(req,res)=>{
  res.render("contact-us");
})


const oAuth2Client= new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

app.post("/connect",async(req,res)=>{
    // console.log("hi");
    // console.log(req.body);
    // // res.send("hii");
    // // res.redirect("/")
      const accessToken=await oAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type:'OAuth2',
          user: process.env.MAIL,
          clientId:process.env.CLIENT_ID,
          clientSecret:process.env.CLIENT_SECRET,
          refreshToken:process.env.REFRESH_TOKEN,
          accessToken:accessToken
        }
      });
      
      const mailOptions = {
        from: "QUANTA TEAM  <QuantaSociety@gmail.com>",
        to: req.body.email,
        cc:"quantasociety@gmail.com",
        subject: `Quanta Team`,
                      // Your message is : ${req.body.email} : ${req.body.name} `,
        text: `Thanks for connecting with us.\n Your message is : ${req.body.message }\n We will connect with you soon.`,
        // html:"<h1>Thanks for connecting with us.</h1>"
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });    
  
  
  
})
  



app.listen(3000,()=>{
    console.log("server is listening on 3000");
})

