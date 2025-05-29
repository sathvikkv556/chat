import express from "express"
import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../Server.js";
import mongoose from "mongoose";

export const getUsersforSideBar=async(req,res)=>
{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");
        // count no of msgs not seen

        const unseenMsg={}
        const promises=filteredUsers.map(async(user)=>
        {
            const messages=await Message.find({senderId:user._id,recieverId:userId,seen:false})
            if(messages.length>0)
            {
                unseenMsg[user._id]=messages.length;

            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMsg})

    }
    catch(e)
    {
        console.log(e.message);
res.json({success:false,message:e.message})
    }
}

export const getMessages=async(req,res)=>

    {
        try{
            const{id:selectedUserId}=req.params;
            const myId=req.user._id;
            const messages=await Message.find({$or:[
                {
                    senderId:myId,
                    recieverId:selectedUserId,

                },
                 {
                    senderId:selectedUserId,
                    recieverId:myId
                    
                }
            ]})
            await Message.updateMany({senderId:selectedUserId,recieverId:myId},
                {seen:true});
            res.json({success:true,messages})

        }
        catch(e)
        {
             console.log(e.message);
             res.json({success:false,message:e.message})
        }
    }

    export const markMessageAsSeen=async(req,res)=>
    {
        try{
           const {id}=req.params;
           await Message.findByIdAndUpdate(id,{seen:true});
           res.json({success:true});

        }
        catch(e)
        {
             console.log(e.message);
             res.json({success:false,message:e.message})
        }
    }

    // send msg to selected user
    export const sendMessage=async(req,res)=>
    {
        try{
            const {text,image}=req.body;
            const recieverId=req.params.id;
            const senderId=req.user._id;

            let imagUrl;

            if(image)
            {
                const uploadResponse=await cloudinary.uploader.upload(image);
                imagUrl=uploadResponse.secure_url;

            }

            const newMessage=await Message.create(
                {
                    senderId,
                    recieverId,
                    text,
                    image:imagUrl
                }

            ) 
            const recieverSocketID=userSocketMap[recieverId];
            if(recieverSocketID)
            {
                io.to(recieverSocketID).emit("newMessage",newMessage);
                
            }


            res.json({success:true,newMessage})
        }
        catch(e)
        {
             console.log(e.message);
             res.json({success:false,message:e.message})
        }
    }

   export const deleteMessage=async (req, res) => {
  try {
    const messageId = req.params.id;

    // Optional: check if messageId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const deleted = await Message.findByIdAndDelete(messageId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}