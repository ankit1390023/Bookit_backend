const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');



router.get('/', experienceController.getAllExperiences);
//testing routes
{/*
//Get all experiences:
GET http://localhost:YOUR_PORT/api/experiences

//Get experiences by category:
GET http://localhost:YOUR_PORT/api/experiences?category=adventure

//Get experiences by location:
GET http://localhost:YOUR_PORT/api/experiences?location=paris

//Get experiences by price range:
GET http://localhost:YOUR_PORT/api/experiences?minPrice=50&maxPrice=200

//Get experiences by search:
GET http://localhost:YOUR_PORT/api/experiences?search=wine

//Get experiences by category, location, and price range:
GET http://localhost:YOUR_PORT/api/experiences?category=food&location=italy&minPrice=30&maxPrice=100
*/}



router.get('/:id', experienceController.getExperienceById);



module.exports = router;