// user tasks like booking appointments, cancelling appointments and viewing appointments, login, register, payment gateway etc...

import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'
import { toast } from 'sonner';

// Registering user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill in all fields" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please provide a strong password!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name, email, password: hashedPassword
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, message: "User created successfully", token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            toast.error('Please fill in all fields')
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        if (!password) {
            return res.json({ success: false, message: "Password is required" });
        }
        if (!user.password) {
            return res.json({ success: false, message: "User password not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);


        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Changing user profile from static to dynamic before getting user details we have to ensure if he is user or not done by authUser.js in middlewares
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });

    } catch (error) {
        console.log('This is profile section in userController.js');
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !gender) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });

        if (imageFile) {
            // Cloudinary uploading
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: 'Profile updated' });

    } catch (error) {
        console.log('Error while updating user profile in userController.js');
        res.json({ success: false, message: error.message });
    }
};


//API for appointment booking

const bookAppointment = async (req, res) => {

    try {

        const {userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData || !docData.available){
            return res.json({success: false, message: 'Doctor not available'})
        }

        let slots_booked = docData.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success: false, message: 'Slot already booked'})
            }else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked 

        const appointmentData = {
            userId,
            docId,
            docData,
            userData: userData, // Ensure userData is included
            slotDate,
            slotTime,
            amount: docData.fees,
            date: Date.now(),
            cancelled: false,


        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()


        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"appointment succesful"})
        
    } catch (error) {
        console.log(error)
        res.json({success:true,message:error.message})
    }

}



//getting booked appointments to frontend
const listAppointments = async (req,res)=>{

    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true,appointments})
        
    } catch (error) {
        console.log(error);
        console.log('list Appointmentslo error');
        res.json({success:false,message:error.message})
        
    }

}


// Xanxelling an Appointment

const cancelAppointment = async (req,res)=>{

    try {

        const {userId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData.userId !== userId){
            return res.json({success:false,message:'Unauthorized Access!'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})


        //clearing doctor slot...!

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e!== slotTime)
        
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true,message:"appointment cancelled!"})



        
    } catch (error) {
        console.log(error)
        console.log("xanxelling and appointemnt in usercontroller.js");
        res.json({success:false,message:error.message})
        
    }
}

//payment using razorpay

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
})

const paymentRazorpay = async (req,res) =>{
    try {
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:"Appointment cancelled or no found!"})
        }

        const options = {
            amount: appointmentData.amount,
            currency:process.env.CURRENCY,
            receipt:appointmentId,
        }

        const order = await razorpayInstance.orders.create(options)

        res.json({success:true,order})

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})

    }
    
}

//payment verification

const verifyPayment = async (req,res)=>{

    try {
        
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status == "paid"){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"payment successful"})
        }else{
            res.json({success:false,message:"payment failed"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,messsage:error.message})
        
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyPayment };
