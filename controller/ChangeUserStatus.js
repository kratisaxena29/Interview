const jwt = require('jsonwebtoken');
const { User }= require('../models/User'); 

const ChangeUserStatus = async (req, res) => {
    try {
       
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({
                Error: 'Authorization failed',
                Message: 'No token provided',
                ErrorCode: 401,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kratitoken');
        if (!decoded) {
            return res.status(403).json({
                Error: 'Invalid Token',
                Message: 'The provided token is invalid or expired',
                ErrorCode: 403,
            });
        }

        await User.updateMany({ status: 'active' }, { $set: { status: 'inactive' } });
        
        await User.updateMany({ status: 'inactive' }, { $set: { status: 'active' } });

        console.log('User statuses toggled successfully.');

        res.status(200).json({
            stutusCode : 200,
            Message: 'User statuses updated successfully'
        })

    } catch (error) {
        console.error("Error occurred while toggling user status:", error);

        res.status(500).json({
            Error: 'Failed to toggle user status',
            Message: 'An error occurred during the process',
            ErrorCode: 500,
        });
    }
};

module.exports = 
{ChangeUserStatus};
