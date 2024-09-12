const { User } = require("../models/User");
const {  encrypt } = require('../middleware/encrypt');
const { decrypt } = require('../middleware/decrypt');
const jwt = require('jsonwebtoken');

const UserRegister = async (req, res) => {
    try {
        let userBody = req.body;
        console.log("Received user body:", userBody);

       
        if (!userBody.email) {
            return res.status(400).json({
                Error: 'Email required',
                Message: 'Email must be provided',
                ErrorCode: 310,
            });
        }

        
        const existingUser = await User.findOne({ email: userBody.email });
        if (existingUser) {
            console.log("Email already registered:", userBody.email);
            return res.status(400).json({
                Error: 'Email already registered',
                Message: 'The provided email is already in use',
                ErrorCode: 309,
            });
        }

       
        let pass = await encrypt(userBody.password);


        const userData = new User({
            name: userBody.name,
            email: userBody.email, 
            password: pass,
            address: userBody.address,
            latitude: userBody.latitude,
            longitude: userBody.longitude,
            status: userBody.status || 'active', 
        });
        console.log("UserData instance created:", userData);

       
        await userData.save();
        console.log("User data saved successfully");

       
        res.status(200).json({
            response: userData,
            Message: 'Profile Details Saved',
            ErrorCode: null,
        });
    } catch (error) {
        res.status(500).json({
            Error: 'Details not saved',
            Message: 'Database Issue',
            ErrorCode: 308,
        });
    }
};


const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

      
        if (!email) {
            return res.status(400).json({
                Error: 'Email required',
                Message: 'Email must be provided for login',
                ErrorCode: 310,
            });
        }

       
        const user = await User.findOne({ email });
        console.log("...user..", user);
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({
                Error: 'User not found',
                Message: 'The provided email does not exist',
                ErrorCode: 401,
            });
        }

       
        if (user.status !== 'active') {
            return res.status(400).json({
                Error: 'Profile not active',
                Message: 'The profile is not currently active',
                ErrorCode: 403,
            });
        }

       
        if (!user.password) {
            console.log("User password is null or undefined:", email);
            return res.status(400).json({
                Error: 'Invalid credentials',
                Message: 'The user password is missing or invalid',
                ErrorCode: 403,
            });
        }

       
        const decryptedPassword = await decrypt(user.password);
        if (decryptedPassword !== password) {
            console.log("Invalid password for:", email);
            return res.status(400).json({
                Error: 'Invalid credentials',
                Message: 'The provided password is incorrect',
                ErrorCode: 402,
            });
        }

       
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'kratitoken',
            { expiresIn: '1h' }
        );

        
        res.status(200).json({
            response: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    latitude: user.latitude,
                    longitude: user.longitude,
                    status: user.status,
                },
            },
            Message: 'Login successful',
            ErrorCode: null,
        });
    } catch (error) {
   
        console.error("Error occurred during login:", error);

      
        res.status(500).json({
            Error: 'Login failed',
            Message: 'An error occurred during the login process',
            ErrorCode: 500,
        });
    }
};



module.exports = {
    UserRegister ,
    UserLogin
}