import express from 'express'

import {addDoctor,allDoctors,loginAdmin} from '../controllers/adminController.js'
import doctorModel from '../models/doctorModel.js'

import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
// adminRouter.post('/add-doctor',upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('all-doctors',authAdmin,allDoctors)

adminRouter.post("/add-multiple-doctors", async (req, res) => {
    try {
        const doctors = req.body;
        if (!doctors || doctors.length === 0) {
            return res.status(400).json({ message: "No doctor data provided" });
        }

        await doctorModel.insertMany(doctors);
        res.json({ success: true, message: "Doctors added successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }

    // https://res.cloudinary.com/duqnqenyt/image/upload/v1738419245/gwnbikvvh8hvbzo7w6f5.png
});

export default adminRouter
