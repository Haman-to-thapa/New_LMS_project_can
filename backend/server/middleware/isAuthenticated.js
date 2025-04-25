import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if(!token) {
      return res.status(401).json({success:false, message:"User not authenticated"})
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if(!decoded) {
      return res.status(401).json({success:false, message:"Invalide token"})
    }
    req.id = decoded.userId;

    next();

  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({success:false, message:"Invalid token format"});
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({success:false, message:"Token has expired, please login again"});
    }
    return res.status(500).json({success:false, message:"Authentication error: " + error.message});
  }
}


export default isAuthenticated;