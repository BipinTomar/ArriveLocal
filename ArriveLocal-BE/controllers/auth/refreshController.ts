import User from "../../models/UserRegister"; // Import the actual User model
const jwt = require('jsonwebtoken');

const handleRefresh =  async(req:any, res: any ) => {
    try {
        // User info is already available from the verifyRefreshToken middleware
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const user = await User.findByEmail(req.user.email);
        const refreshToken = req.cookies.refreshToken;

        if (!user || !user.refreshTokens?.includes(refreshToken)) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role }
                    , process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "15m"}
            );

        // Generate new refresh token (token rotation)
        const newRefreshToken = jwt.sign(
            { id: user.id, email: user.email }
                    , process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: "1d"}
            );

        // Update refresh tokens (remove old, add new)
        const updatedTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        updatedTokens.push(newRefreshToken);
        await User.updateTokens(user.email, updatedTokens);

        // Set new refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge:  24 * 60 * 60 * 1000
        });

        res.json({ 
            message: "Token refreshed successfully",
            accessToken 
        });
    } catch (err: any) {
        console.error('Error in handleRefresh:', err);
        res.status(500).json({ 
            error: "Server error", 
            details: err.message 
        });
    }
}

module.exports = {handleRefresh}


