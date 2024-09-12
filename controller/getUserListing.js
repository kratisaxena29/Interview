const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User'); 


const getUserListing = async (req, res) => {
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

      const { week_number } = req.query;
      if (!week_number) {
        return res.status(400).json({ message: "week_number query is required" });
      }
  
    
      const weekNumbers = week_number.split(',').map(Number);
  
 
      const daysMap = {
        0: { mongoDay: 1, name: 'Sunday' },
        1: { mongoDay: 2, name: 'Monday' },
        2: { mongoDay: 3, name: 'Tuesday' },
        3: { mongoDay: 4, name: 'Wednesday' },
        4: { mongoDay: 5, name: 'Thursday' },
        5: { mongoDay: 6, name: 'Friday' },
        6: { mongoDay: 7, name: 'Saturday' },
      };
  
    
      let userListing = {};
  
      for (let dayIndex of weekNumbers) {
        const dayData = daysMap[dayIndex]; 
  
        if (!dayData) continue; 
  
       
        const users = await User.find({
          $expr: { $eq: [{ $dayOfWeek: '$createdAt' }, dayData.mongoDay] },
        }).select('name email'); 
  
        userListing[dayData.name] = users.map(user => ({
          name: user.name,
          email: user.email,
        }));
      }
  
      res.status(200).json({
        status_code: 200,
        message: 'User listing retrieved successfully',
        data: userListing,
      });
    } catch (error) {
      console.error('Error occurred while fetching user listing:', error);
      res.status(500).json({
        status_code: 500,
        message: 'An error occurred while fetching the user listing',
      });
    }
  };

module.exports = {
    getUserListing
}



