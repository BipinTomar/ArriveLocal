import {  ILogin } from "../../models/UserInterface";
import User from "../../models/UserRegister"; // Import the actual User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const handleLogin =async  (req: any, res: any ) => {
    const { email, password }: ILogin = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
          error: "Email and password are required" 
        });
      }
      console.log("Helleo", process.env.ACCESS_TOKEN_SECRET);
      try {
        // 1. Find user by email using static method
        const existingUser = await User.findByEmail(email);
    
        if (!existingUser) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // 2. Compare password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid password" });
        }
        const accessToken = jwt.sign(
            { id: existingUser.id, email: existingUser.email, role: existingUser.role }
                    , process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "15m"}
            );

        const refreshToken = jwt.sign(
            { id: existingUser.id, email: existingUser.email }
                    , process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: "1d"}
            );
            //update refresk Tokens in file or DB 
            const updatedTokens = [...(existingUser.refreshTokens || []), refreshToken];
            // updatedTokens.push(refreshToken);
            await User.updateTokens(existingUser.email, updatedTokens);
        res.cookie(
            "refreshToken",refreshToken,
            {httpOnly: true, sameSite: 'None', maxAge:  24 * 60 * 60 * 1000}
        );
        // 3. Success response
        res.status(200).json({
          message: "Login successful",
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            accessToken : accessToken
          },
        });
      } catch (err: any) {
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

module.exports = {handleLogin};