// import React from 'react'

import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets_frontend/assets"
import RelatedDoctors from "../components/RelatedDoctors"
import axios from "axios"

const Appointment = () => {

  const {docId} = useParams()
  const {doctors,currency, backendUrl,token,getDoctorsData} = useContext(AppContext)

  const navigate = useNavigate()
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo,setDocInfo] = useState(null)
  const [docSlots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')

  const fetchDoctorInfo = async () => {
    

    const docInfo = await doctors.find((doc) => doc._id === docId);
   
    setDocInfo(docInfo);
  }

  const getAvailableSlots = async () => {
    if (!docInfo || !docInfo.slots_booked) return;

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
        
        let day = currentDate.getDate()
        let month = currentDate.getMonth()+1
        let year = currentDate.getFullYear()

        const slotDate = day+"_"+month+"_"+year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;


        
       isSlotAvailable && timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
      

        currentDate.setMinutes(currentDate.getMinutes()+30)
        
      }
      groupedSlots.push(timeSlots)

      setDocSlots(groupedSlots)
    }
  }

  const bookAppointment = async ()=>{

    if(!token){
      alert("Log in to book appointment")
      return navigate('/login')
    }

    try {

      if (!slotTime || !docSlots[slotIndex] || !docSlots[slotIndex][0]) {

        alert("Please select both date and time.");
        return;
      }

      const date = docSlots[slotIndex][0].datetime; // Ensure docSlots[slotIndex][0] is defined
      if (date.getHours() >= 20 && date.getMinutes() > 30) {
        alert("Booking is available from tomorrow.");
        return;
      }




      let day = date.getDate()
      let month = date.getMonth()+1
      //since jan we are getting 0
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year
      // console.log(slotDate);
      if(!slotDate){
        alert("No slots selected")
      }

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { userId: token, docId, slotDate, slotTime }, { headers: { token } });


      if (data.success) {
        alert("Appointment booked");
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        alert(data.message);
      }
      
      if (docSlots[slotIndex].length === 0) {
        alert("No slots available for the selected date.");
        return;
      }

      



      
    } catch (error) {
      console.log(error)
      console.log("appointment.jsx lo error")
      console.log(error.message);
      
    }
  }

  useEffect(()=>{
    fetchDoctorInfo()
    getDoctorsData()
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
      <div className="flex gap-3 items-center overflow-scroll w-full mt-4">
        {docSlots.length > 0 && docSlots.map((daySlots, index) => (
          daySlots.length > 0 && (
            <div
              key={index}
              className={`text-center py-6 min-w-16 rounded-full overflow-scroll cursor-pointer ${
                slotIndex === index ? "bg-primary text-white" : "border border-gray-200"
              }`}
              onClick={() => {
                setSlotIndex(index); 
              }}
            >
              <p>{daysOfWeek[new Date(daySlots[0]?.datetime).getDay()]}</p>
              <p>{new Date(daySlots[0]?.datetime).getDate()}</p>
            </div>
          )
        ))}

       

      </div>

      <div className="flex items-center gap-3 w-full mt-4 overflow-scroll" >
        {docSlots.length &&
          docSlots[slotIndex].map((item, index) => (
            <p onClick={()=>{setSlotTime(item.time)}} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time==slotTime ? 'bg-primary text-white':'border border-gray-300 text-gray-600'}`} key={index}>{item.time.toLowerCase()}</p>
          ))}
      </div>

      <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">

        Book An Appointment
      </button>
</div>


<RelatedDoctors docId={docId} speciality={docInfo.speciality} />

 </div>


          
  )
  
}

export default Appointment
