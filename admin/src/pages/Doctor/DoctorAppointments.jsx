/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const DoctorAppointments = () => {
    const { dtoken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { currency } = useContext(AppContext);

    useEffect(() => {
        if (dtoken) {
            getAppointments();
        }
    }, [dtoken]);

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white-border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_3fr_1fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>
                {
                    appointments.reverse().map((item, index) => (
                        <div className='flex flex-wrap justify-center max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_3fr_1fr_2fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100' key={index}>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='w-10 rounded-full sm-flex'>
                                {item.userData && <img src={item.userData.image} alt="user" />}
                                <p>{item.userData ? item.userData.name : 'Unknown User'}</p>
                            </div>
                            <div>
                                <p className='text-xs inline border border-primary px-2 rounded-full'>{item.payment ? "Online" : "Cash"}</p>
                            </div>
                            <p>{item.slotDate.replace(/_/g, '-')}, {item.slotTime}</p>
                            <p>{currency}{item.amount}</p>
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
    );
}

export default DoctorAppointments;
