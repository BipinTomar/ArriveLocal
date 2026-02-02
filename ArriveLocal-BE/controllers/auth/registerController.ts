import {  IRegister, IUser } from "../../models/UserInterface";
import User from "../../models/UserRegister"; // Import the actual User model
const bcrypt = require('bcrypt');
import {z}  from 'zod';


const handleRegister = async  (req: any, res: any ) => {
    const { name, email, password, mobile, role }: IRegister = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }
    if(email)
    {
      const emailMatchFlag = email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if(!emailMatchFlag)
        {
          return res.status(400).json({ 
              error: "Email Format is not correct" 
        });
       }
      }
   
    const saltRounds = 6;
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    
    const newUser: IUser = {
      name,
      email,
      password : hashedPassword, // mapped the password 
      mobile,
      role: role || "user"
    };
    const user = new User(newUser);
    const savedUser = await user.save();
    
    res.status(201).json({ 
      message: "User created", 
      user: savedUser// Use newUser instead of savedUser
    });
}

module.exports = {handleRegister};