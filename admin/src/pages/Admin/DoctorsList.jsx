/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsLlist = () => {

  const {doctors,atoken,getAllDoctors,changeAvailability} = useContext(AdminContext)

  useEffect(()=>{
    if (atoken) {
      getAllDoctors()
      } 
  },[atoken])

  return (
    <div className='flex-1 m-5 overflow-y-auto' >

      <h1 className='text-lg font-medium'>ALL Doctors</h1>
      <div className='w-full flex flex-wrap gap-3 pt-5 pb-5 gap-y-6'>

        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>

              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='mt-2  flex items-center gap-1 text-sm'>
                <input  type="checkbox" onChange={()=>{changeAvailability(item._id,item.name)}} name="availability" id="availability" checked={item.available} />
                <p>available</p>

                </div>
              </div>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsLlist
