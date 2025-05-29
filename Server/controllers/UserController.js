import { generatetoken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

export const signup=async(req,res)=>
{
 const {fullName,email,password,Bio}=req.body;

 try{
    if(!fullName||!email||!password||!Bio)
    {
        return res.json({success:false,message:"missing details"})

    }
    const user=await User.findOne({email});
    if(user)
    {
        return res.json({success:false,message:"account already exists"});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);
    const newuser=await User.create(
        {
            fullName,email,password:hashedpassword,Bio
        }
    )
    const token=generatetoken(newuser._id);
    res.json({success:true,userData:newuser,token,message:"account created successfully"})
 }
 catch(error)
 {
    console.log(error.message);
    res.json({success:false,message:error.message})

 }
}


export const login=async(req,res)=>
{ 
    try{
        const {email,password}=req.body;
    const userData=await User.findOne({email});
    const isPasswordCorrect=await bcrypt.compare(password,userData.password);
    if(!isPasswordCorrect)
    {
        return res.json({success:false,message:"missing details"})
    }
 const token=generatetoken(userData._id);
    res.json({success:true,userData,token,message:"login successfull"})
}
 catch(error)
 {
    console.log(error.message);
    res.json({success:false,message:error.message})

 }
    
}

export const checkAuth=(req,res)=>
{
    res.json({success:true,user:req.user});
}

// controller to update user profile
 export const updateProfile = async (req, res) => {
  try {
    const { profilePic, Bio, fullName } = req.body;
    const userId = req.user._id;
    let updateduser;

    if (!profilePic) {
      updateduser = await User.findByIdAndUpdate(
        userId,
        { Bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateduser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, Bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updateduser });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};
