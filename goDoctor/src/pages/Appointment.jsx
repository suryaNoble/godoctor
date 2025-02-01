// import React from 'react'

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets_frontend/assets"
import RelatedDoctors from "../components/RelatedDoctors"

const Appointment = () => {

  const {docId} = useParams()
  const {doctors,currency} = useContext(AppContext)

  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo,setDocInfo] = useState(null)
  const [docSlots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')

  const fetchDoctorInfo = async ()=>{
    const docInfo = doctors.find((doc)=>doc._id === docId)
    setDocInfo(docInfo)
    
  }

  const getAvailableSlots = async ()=>{
      setDocSlots([])

      let today = new Date()

      let groupedSlots = []

      for (let i=0;i<7;i++){
        let currentDate = new Date(today)
        currentDate.setDate(today.getDate()+i)

        let endTime = new Date()
        endTime.setDate(today.getDate()+i)
        endTime.setHours(21,0,0,0)


        if(today.getDate() === currentDate.getDate() && currentDate.getHours()>=10){
          if(currentDate.getMinutes() > 30){
            currentDate.setHours(currentDate.getHours()+1)
            currentDate.setMinutes(0)
          }
          else if(currentDate.getMinutes() < 30){
            currentDate.setHours(currentDate.getHours())
            currentDate.setMinutes(30)
          }else{
            currentDate.setHours(10)
            currentDate.setMinutes(0)
          }
        }else{
          currentDate.setHours(10)
          currentDate.setMinutes(0)
        }

        let timeSlots =[]

        while(currentDate<endTime){
          let formattedTime = currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })

          currentDate.setMinutes(currentDate.getMinutes()+30)
          
        }
        groupedSlots.push(timeSlots)



        setDocSlots(groupedSlots)


      }
 
  }

  useEffect(()=>{
    fetchDoctorInfo()
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])

  
  return docInfo &&(
    <div>
      <div className="flex flex-col sm:flex-row gap-4" >
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0" >
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900" >
            {docInfo.name}
            <img src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600" >
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full" >{docInfo.experience}</button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-800 mt-3" >About <img src={assets.info_icon} alt="info icon" /></p>
            <p  className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p  className="text-gray-500 font-medium mt-4" >
            Appointment Fees: <span className="text-gray-600" >{currency}{docInfo.fees}</span>
          </p>
        </div>
        

        </div>


      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
      <p>Booking Slots</p>
      <div className="flex gap-3 items-center w-full mt-4">
        {docSlots.length &&
          docSlots.map((daySlots, index) => (
            <div
              key={index}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? "bg-primary text-white" : "border border-gray-200"
              }`}
              onClick={() => {
                setSlotIndex(index); 
              }}
            >
              <p>{daysOfWeek[new Date(daySlots[0].datetime).getDay()]}</p>
              <p>{new Date(daySlots[0].datetime).getDate()}</p>
            </div>
          ))}
      </div>

      <div className="flex items-center gap-3 w-full mt-4 overflow-scroll" >
        {docSlots.length &&
          docSlots[slotIndex].map((item, index) => (
            <p onClick={()=>{setSlotTime(item.time)}} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time==slotTime ? 'bg-primary text-white':'border border-gray-300 text-gray-600'}`} key={index}>{item.time.toLowerCase()}</p>
          ))}
      </div>

      <button  className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6" >
        Book An Appointment
      </button>
</div>


<RelatedDoctors docId={docId} speciality={docInfo.speciality} />

 </div>


          
  )
  
}

export default Appointment