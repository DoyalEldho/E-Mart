const userModel = require('../models/userModel');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



//google sign in
const googleSignIn=  async (req, res) => {
  try {
    const { email, name, googleId } = req.body
    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({ email, name, googleId ,role:"customer" })
      await user.save()
    }

    const token = jwt.sign({ id: user._id,name:user.name,email:user.email,role:user.role }, process.env.JWT_SECRET)
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Google login success' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}



const userRegister = async (req, res) => {
  const { name, email, password,role } = req.body;

  try {
    //  Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const users = new userModel({ name, email, password: hashPassword ,role });

    const saveDetails = await users.save();
    res.json({ message: 'Registered Sucessfully' });

  } catch (error) {
    res.status(500).json({ error: "Saving failed", details: error.message });
  }
};

const userLogin = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'user not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'password not matching' });

    const token = jwt.sign({ id: user._id,name:user.name,email:user.email,role:user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
      maxAge: 36000000,
    });

    res.json({ message: 'Login successful',role: user.role});

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }

}

const userInfo = async(req,res)=>{
    res.json({
        name:req.user.name,
        id:req.user.id,
      email:req.user.email,
      role:req.user.role
    })
}



module.exports = {
 userRegister,
  userLogin,
  userInfo,
  googleSignIn
}