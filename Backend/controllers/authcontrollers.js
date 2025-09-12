const phonevalidate = require('../utils/validatephonenumber');
const verifyotp = require('../utils/verifyotp');
const sendotp = require('../utils/sendotp');
const User = require('../models/user');
const generateJWT = require('../utils/generatejwt');

exports.signup_sendotp = async (req, res) => {
    try {
      const phone = req.body.phone;
  
      // Validate phone number
      const isvalid = phonevalidate(phone);
      if (isvalid.error) {
        return res.status(400).send({ message: isvalid.error.details[0].message });
      }
  
      // Check if user already exists
      const exists = await User.findOne({ phone });
      if (exists) {
        return res.status(400).send({ message: "User already exists" });
      }
  
      // Send OTP
      await sendotp(phone);
      return res.status(200).send({ message: "OTP sent successfully" });
  
    } catch (error) {
      console.error("Signup send-otp error:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
};

exports.signup_verifyotp = async (req ,res)=>{
    try {
        // take phone and otp from req
        const phone = req.body.phone;
        const otp = req.body.otp;
        // verify otp
        const VerifyResult = await verifyotp(phone,otp);
        if(VerifyResult.status === 'approved'){
            const newuser = new User({
                phone:phone
            })
            await newuser.save();
            await User.findOneAndUpdate({phone:phone},{
                $set:{
                    isPhoneVerified:true
                }
            })
            // creating and sending a jwt token
            const user = await User.findOne({phone:phone});
            const token = generateJWT(user);
            return res.status(200).send({message:"User verified and created successfully", token:token, redirectUrl: "http://localhost:5173"});
          }
          //invalid otp
          else{
            return res.status(400).send({message:"Invalid OTP"});
          }
        

        // if otp is valid create user in db

        
    } catch (error) {
        console.error("Signup verify-otp error:", error);
        return res.status(500).send({ message: "Internal server error" });
        
    }
};

exports.login_sendotp = async (req, res)=>{
    try {
      const phone = req.body.phone;
      // validate phone number 
      const isvalid = phonevalidate(phone);
      if (isvalid.error) {
        return res.status(400).send({ message: isvalid.error.details[0].message });
      }
      // check if user exists
      const user = await User.findOne({phone:phone});
      if(!user){
        return res.status(400).send({message:"User does not exist, please signup first"});
      }
      // send otp
      await sendotp(phone);
      return res.status(200).send({message:"OTP sent successfully"});
  
      
    } catch (error) {
      console.error("Login send-otp error:", error);
      return res.status(500).send({ message: "Internal server error" });
      
    }
};

exports.login_verifyotp = async (req,res)=>{
    try {
      // take phone and otp from req
      const phone = req.body.phone;
      const otp = req.body.otp;
      // verify otp
  
      const VerifyResult = await verifyotp(phone,otp);
      if(VerifyResult.status === 'approved'){
        const user = await User.findOne({phone:phone});
        await User.findOneAndUpdate({phone:phone},{
          $set:{
            isPhoneVerified:true
          }
        })
        // creating and sending a jwt token
        const token = generateJWT(user);
        // console.log(token);
        return res.status(200).send({message:"User verified and logged in successfully", token:token, redirectUrl: "http://localhost:5173"});
  
      }
      
    } catch (error) {
      console.error("Login verify-otp error:", error);
      return res.status(500).send({ message: "Internal server error" });
  
      
    }
};

 