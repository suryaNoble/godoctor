import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment,paymentRazorpay, verifyPayment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import passport from 'passport'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)

userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)

userRouter.post('/payment',authUser,paymentRazorpay)
userRouter.post('/verifyPayment',authUser,verifyPayment)



userRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
}));

userRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/about' }),
    (req, res) => {
        res.redirect('http://localhost:5173/navbar');
    });

export default userRouter;
