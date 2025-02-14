/* eslint-disable react/prop-types */
// import React from 'react'

import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"


const RelatedDoctors = ({docId,speciality}) => {

    const {doctors} = useContext(AppContext)

    const [relDoc,setReldoc] = useState([])

    const navigate = useNavigate()

    useEffect(()=>{
        
        if(doctors.length > 0 && speciality){
            const relatedDocs = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setReldoc(relatedDocs)
        }

    },[doctors,speciality,docId])


  return (
    <div className="flex flex-col items-center gap-4 my-16 md:mx-10 text-gray-900">
        <h1 className="text-3xl font-medium">Doctors IN The Same Field</h1>
        <p className="sm:w-1/3 text-center text-sm">Simply Browse Through Our Extensive Doctors in same field </p>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
            {relDoc.slice(0,5).map((item,index)=>(
                <div key={index} onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 ">
                    <img className="bg-blue-50" src={item.image} alt="raatleda?" />
                    <div className="p-4">
                        <div className="flex items-center gap-2 text-sm text-center">
                        <p className={`w-2 h-2 ${item.available?'bg-green-500':'bg-gray-500'}  rounded-full`}></p>
                        <p className={`${item.available?'text-green-600':'text-gray-600'}`} >{item.available?'Available':"Unavaiable"}</p>
                        </div>
                        <p className="text-gray-900 text-lg font-medium" >{item.name}</p>
                        <p className="text-gray-600 text-sm ">{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        <button onClick={()=>{navigate("/doctors"); scrollTo(0,0)}} className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:underline" >See More&gt;&gt;</button>
    </div>
  )
}

export default RelatedDoctors