const { User } = require("../models/User");
const {  encrypt } = require('../middleware/encrypt');
const { decrypt } = require('../middleware/decrypt');

const UserRegister = async (req, res) => {
    try {
        let userBody = req.body;
        console.log("Received user body:", userBody);

        // Check if email is provided
        if (!userBody.email) {
            return res.status(400).json({
                Error: 'Email required',
                Message: 'Email must be provided',
                ErrorCode: 310,
            });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email: userBody.email });
        if (existingUser) {
            console.log("Email already registered:", userBody.email);
            return res.status(400).json({
                Error: 'Email already registered',
                Message: 'The provided email is already in use',
                ErrorCode: 309,
            });
        }

        // Encrypt the password
        let pass = await encrypt(userBody.password);

        // Create new User instance with the required fields
        const userData = new User({
            name: userBody.name,
            email: userBody.email, // Include email only if it exists
            password: pass,
            address: userBody.address,
            latitude: userBody.latitude,
            longitude: userBody.longitude,
            status: userBody.status || 'active', // Default to 'inactive' if not provided
        });
        console.log("UserData instance created:", userData);

        // Save the user data to the database
        await userData.save();
        console.log("User data saved successfully");

        // Send success response
        res.status(200).json({
            response: userData,
            Message: 'Profile Details Saved',
            ErrorCode: null,
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Error occurred:", error);

        // Send error response
        res.status(500).json({
            Error: 'Details not saved',
            Message: 'Database Issue',
            ErrorCode: 308,
        });
    }
};



module.exports = {
    UserRegister
}