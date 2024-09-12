const {User} = require("../models/User")
const jwt = require('jsonwebtoken');
const geolib = require('geolib');

const getDistance = async (req, res) => {
    try {
      
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status_code: 401,
                message: 'Authorization token is required',
            });
        }

       
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kratitoken');
        if (!decoded) {
            return res.status(403).json({
                status_code: 403,
                message: 'Invalid or expired token',
            });
        }

       
        const userId = decoded.id;
        console.log("...userId")
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status_code: 404,
                message: 'User not found',
            });
        }

        const userLatitude = user.latitude;
        const userLongitude = user.longitude;

       
        const { destination_latitude, destination_longitude } = req.query;
        if (typeof destination_latitude !== 'string' || typeof destination_longitude !== 'string') {
            return res.status(400).json({
                status_code: 400,
                message: 'Destination latitude and longitude are required',
            });
        }

        const destinationLatitude = parseFloat(destination_latitude);
        const destinationLongitude = parseFloat(destination_longitude);

        if (isNaN(destinationLatitude) || isNaN(destinationLongitude)) {
            return res.status(400).json({
                status_code: 400,
                message: 'Invalid latitude or longitude format',
            });
        }

       
        const distance = geolib.getDistance(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: destinationLatitude, longitude: destinationLongitude }
        );

     
        const distanceInKm = distance / 1000;

        
        res.status(200).json({
            status_code: 200,
            message: 'Distance calculated successfully',
            distance: `${distanceInKm.toFixed(2)} km`
        });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({
            status_code: 500,
            message: 'An error occurred while calculating the distance',
        });
    }
};

module.exports = {
    getDistance
}