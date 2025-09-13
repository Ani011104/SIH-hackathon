const User = require("../models/user")
const validateuser = require("../utils/validateuser")
const mongoose = require("mongoose")
const address = require("../models/address")


exports.patchUser = async (req , res) => {
    try {
        const phone = req.body.phone
        const { error } = validateuser(req.body)
        if(error)
        {
            return res.status(400).json({ message: error.details[0].message })
        }
        const { username , height , weight , Dob , gender , email } = req.body
        const user = await User.findOneAndUpdate({ phone: phone },
             { username , height , weight , Dob , gender , email }, 
            { new: true })
        if(user)
        {
            return res.status(200).json({ message: "User updated successfully" , user })
        }
        else
        {
            return res.status(400).json({ message: "User not found" })
        }


        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // fetch all users
    const count = await User.countDocuments(); // count total users

    return res.status(200).json({ count, users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

