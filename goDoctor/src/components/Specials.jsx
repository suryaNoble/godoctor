// import React from 'react'
import { specialityData } from "../assets/assets_frontend/assets"
import { Link } from "react-router-dom"
const Specials = () => {
  return (
    <div id='specials' className="flex flex-col items-center gap-4 py-16 text-gray-800">
        <h1 className="text-5xl font-medium">Our World class Specialities</h1>
        <p className="sm:w-1/3 text-center text-md">World class hauyaUOIAGUIS fiusaF specialists in every field with a1 equipements and kits with advancement of AI </p>
        <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
            {specialityData.map((data,index) => (
        
                    <Link onClick={()=>{scrollTo(0,0)}} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-300" key={index} to={`/doctors/${data.speciality}`}>
                    <img  className='w-16 sm:w-24 mb-2' src={data.image} alt={data.speciality} />
                    <h2>{data.speciality}</h2>
                    </Link>
        
            ))}
        </div>
    </div>
  )
}

export default Specials