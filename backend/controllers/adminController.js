import validator from 'validator'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
//Adding doctor by admin

const addDoctor = async (req,res) => {

    try {
        // console.log(req.body)
        // console.log('req.body')
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body
        //we have an image file parsed by upolad.single(image) in adminRoute.js
        const imageFile = req.file

        //if any value is missed it wii be default-undefined and we will send a message to fill all the fields
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
            return res.status(400).json({message:"Please fill all the fields"})
        }

        if(validator.isEmail(email) === false){
            return res.status(400).json({message:"Invalid Email"})
        }else if(password.length < 8){
            return res.status(400).json({message:"Password must be atleast 8 characters long"})
        }


        const salt  = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url
 
        const doctorData = {
            name,email,password:hashedPassword,image:imageUrl,speciality,degree,experience,about,fees,address:JSON.parse(address),date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor added successfully"})

    } catch (error) {
        console.log('adminController lo undi error')
        console.log(error)
        res.status(500).json({message:error.message})
        console.log('adminController.js lo undi error')
    }
}


//admin login kosam env lo unchina default values

const loginAdmin = async (req,res)=>{
    try {
       const {email,password} = req.body
       if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){

        const atoken = jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,atoken:atoken})
       }else{
        res.json({success:false,message:"Invalid Email or Password"})
       }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}



//baxkend nundi doctors list All doctors

const allDoctors = async (req,res) =>{
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// admin API to get all Appointments
const appointmentsAdmin = async (req,res)=>{
    try {

        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
        
    } catch (error) {
        console.log(error);
        res.json({success:true,message:"errror while admin  getting all appoinments adminController"})
    }
}


//admin cancelling an appointment

const cancelAppointmentAdmin = async (req,res)=>{

    try {

        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        

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
        console.log("xanxelling and appointemnt in Admincontroller.js");
        res.json({success:false,message:error.message})
        
    }
}



// API for admin dashboard

const adminDashboard = async (req,res)=>{
    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        console.log(doctors);
        console.log(users);
        console.log(appointments);
        console.log('dminXontroller lo adminDasboard');
        

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        console.log(dashData);
        

        res.json({success:true,dashData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})        
    }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin, cancelAppointmentAdmin, adminDashboard}