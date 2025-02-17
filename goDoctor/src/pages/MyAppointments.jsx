/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner";


const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData} = useContext(AppContext)

  const [appointments,setAppointments] = useState([])

  const navigate = useNavigate()

  const getUserAppointments = async ()=>{
    try {
      const {data} = await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})

      if(data.success){
        setAppointments(data.appointments.reverse())
        // console.log('Myappointments.jsx lo getUserAppointments');
        // console.log(data)
        // console.log(data.appointments);
        
      }
    } catch (error) {
      console.log(error);
      console.log('MYAppointments.jsx lo unnav');    
      
    }
  }


  const cancelAppointment = async (appointmentId)=>{
    try {
      
      const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }else{
        toast.warning(data.message)
      }
    } catch (error) {
      console.log(error);
      console.log('Myappointments.jsx lo cancalappointments');
      
    }
  }



const initpay = (order)=>{

  const options ={
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount:order.amount,
    currency:order.currency,
    name:'Appointment payment',
    description:'Appointment payment',
    order_id:order.id,
    receipt:order.receipt,
    handler:async (response) =>{
     
      try {
        const {data} = await axios.post(backendUrl+'/api/user/verifyPayment',response,{headers:{token}})
        if(data.success){
          getUserAppointments()
          navigate('/my-appointments')
        }
      } catch (error) {
        console.log(error);
        
      }
    }

  }

  const rzp = new Razorpay(options).open()


}

  
  const appointmentRazorpay = async (appointmentId)=>{

    try {
      
      const {data} = await axios.post(backendUrl+'/api/user/payment',{appointmentId},{headers:{token}})
      
      if(data.success){
          initpay(data.order)  
                
      }else{
        console.log('success kaadu faliure myappointment.jsx lo appointment razorpay');
      }
    }catch (error) {
      console.log(error);
      console.log('payment error in MYAppointment.jsx');
      
      
    }

  }


  useEffect(()=>{
    if (token) {

      getUserAppointments()
      getDoctorsData()
    }
  },[token])


  if(appointments.length === 0){
    return(
      <p className='text-center font-bold text-orange-500 p-4' >No Appointments made</p>
    )
  }else{
  return (
    <div>
    
      <p className='pb-1 mt-12 font-medium text-zinc-700 border-b' >My Appointments</p>
      <div>
          { appointments.slice().map((item,index)=>(
            <div key={index} className='grid grid-cols-[1fr 2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600' >
                <p className='text-neutral-800 font-semibold' >{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1' >Address:</p>
                <p className='text-xs' >{item.docData.address.line1}</p>
                <p className='text-xs' >{item.docData.address.line2}</p>
                <p className='text-xs mt-1' > <span className='text-sm text-neutral-700 font-medium' >Date & Time:</span> {item.slotDate.replace(/_/g, " ")} | {item.slotTime} </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-center' >
                {item.payment?<button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:hover:text-black' disabled={item.cancelled || item.payment}  >Paid</button>
              : item.isCompleted?<button className='font-semibold  text-center sm:min-w-48 py-8 border rounded text-green-800 hover:bg-green-800 hover:text-white transition-all duration-300'>Apointment Completed</button>: <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:hover:text-black' disabled={item.cancelled}  >Pay Online</button>
              }
                {/* {!item.cancelled && <button onClick={()=>{cancelAppointment(item._id)}} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300' >Cancel Appointment</button>} */}
                {item.cancelled? <button className='text-sm  text-center sm:min-w-48 py-2 border rounded text-red-800 hover:bg-red-700 hover:text-white transition-all duration-300'>Apointment Cancelled</button> : item.isCompleted? <></>: <button onClick={()=>{cancelAppointment(item._id)}} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300' >Cancel Appointment</button>}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
  }
}

export default MyAppointments