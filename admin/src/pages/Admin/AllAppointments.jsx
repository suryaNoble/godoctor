/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import {assets} from '../../assets/assets_admin/assets'

const AllAppointments = () => {

  const {atoken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
  const {currency} = useContext(AppContext)
  console.log('allappointments lo appintmensts payment kosam');
  console.log(appointments);
  
  

  useEffect(()=>{
    if(atoken){
      getAllAppointments()
    }
  },[atoken])


  return (

    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 tet-lg font-medium' >All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll' >
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_3fr_3fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b' >
          <p>#</p>
          <p>Patient</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Payment</p>
          <p>Actions</p>
        </div>

        {
          appointments.map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_3fr_3fr_1fr_1fr_1fr] items-center hover:bg-gray-100 text-gray-600 grid-flow-col py-3 px-6 border-bottom' key={index}>
              <p className='max-sm:hidden ' >{index+1}</p>
            <div className='flex items-center gap-2' >
              <img className='w-8 h-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
            </div>
            <p>{item.slotDate.replace(/_/g," ")},{item.slotTime}</p>
            <div className='flex items-center gap-2' >
            <img className='w-8 h-8 rounded-full bg-gray-200' src={item.docData.image} alt="" /> <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            <p>{item.payment?'paid':'NO'}</p>
            {
              item.cancelled
              ? <p className='text-red-300 text-xs font-medium' >Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-400 text-xs font-medium'>Completed</p>
                :<img onClick={()=>{cancelAppointment(item._id)}} className='w-10 cursor-pointer ' src={assets.cancel_icon} alt="" />

            }
            </div>
          ))
        }


      </div>
      
    </div>
  )


}


export default AllAppointments
