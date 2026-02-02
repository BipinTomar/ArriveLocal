
import User from "../../models/UserRegister"; // Import the actual User model
const jwt = require('jsonwebtoken');


const handleLogout = async (req: any, res: any) => {
    try {
      // If you were using JWT or sessions, here is where you'd invalidate them
      const refreshToken = req.cookies.refreshToken;
      if(refreshToken)
      {
        let payloadDecoded: any ;
        try {
            payloadDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          } catch (err) {
            // token invalid
            res.clearCookie("refreshToken", {httpOnly: true, sameSite: 'None', maxAge:  24 * 60 * 60 * 1000});
            return res.status(200).json({ message: "Logged out successfully" });
          }


        // const decoded: any = jwt.decode(refreshToken);
        if(payloadDecoded?.email)
        {
            const user = await User.findByEmail(payloadDecoded.email);
            if (user && user.refreshTokens) {
                const newTokens = user.refreshTokens.filter(
                  (token) => token !== refreshToken
                );
                await User.updateTokens(user.email, newTokens);
                console.log("refresh deleted ");
              }
        }
      }
      // For now, we just return success
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logout successful" });
    } catch (err: any) {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }

  module.exports = { handleLogout};