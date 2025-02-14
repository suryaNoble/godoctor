/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import {DoctorContext } from '../../context/DoctorContext'
import {assets} from '../../assets/assets_admin/assets'
import {AppContext} from '../../context/AppContext'
const DoctorDashboard = () => {
  const {dtoken,dashData,setDashData,getDashData,cancelAppointment,completeAppointment} = useContext(DoctorContext)
  const {currency} = useContext(AppContext)

  useEffect(()=>{
    if(dtoken){
      getDashData()
    }
  },[dtoken])


  return dashData && (
    <div className='m-5' >
    
          <div className='flex flex-wrap gap-3' >
            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all' >
                <img className='w-14' src={assets.earning_icon} alt="doc" />
                <div className=''>
                  <p className='text-xl font-semibold' >{currency} {dashData.earnings}</p>
                  <p className='text-gray-400' >Earnings</p>
                </div>
            </div>
            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all' >
                <img className='w-14' src={assets.appointments_icon} alt="doc" />
                <div className=''>
                  <p className='text-xl font-semibold' >{dashData.appointments}</p>
                  <p className='text-gray-400' >Appointments</p>
                </div>
            </div>
            <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all' >
                <img className='w-14' src={assets.patients_icon} alt="doc" />
                <div className=''>
                  <p className='text-xl font-semibold' >{dashData.patients}</p>
                  <p className='text-gray-400' >Patients</p>
                </div>
            </div>
    
          </div>
    
          <div className='bg-white' >
    
            <div className='flex items-center gap-2.5  px-4 py-4 m-10 rounded-t border border-gray-200' >
              <img src={assets.list_icon} alt="" />
              <p className='font-semibold' >Latest Bookings</p>
            </div>
    
            <div className='pt-4 border border-t-0 border-gray-200' >
              {
                dashData.latestAppointments.map((item,index)=>(
    
                  <div key={index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' >
                    <img className='rounded-full w-10' src={item.userData.image} alt="daku" />
                    <div className='flex-1 text-sm' >
                      <p className='text-gray-800 font-medium' >{item.userData.name}</p>
                      <p className='text-gray-600' >{item.slotDate.replace(/_/g,' ')}</p>
                    </div>
                    {
                      item.cancelled
                      ? <p className='text-red-600 text-xs font-medium' >Cancelled</p>
                  
                      : item.isCompleted
                          ? <p  className='text-green-600 text-xs font-medium'>Completed</p>
                          : <div className='flex'>
                          <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                          <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                            </div>
                    }
                  </div>
    
    
                ))
              }
    
            </div>
            
    
          </div>
          
        </div>
  )
}

export default DoctorDashboard
