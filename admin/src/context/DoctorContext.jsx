/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createContext } from "react";

export const DoctorContext = createContext()

const DoctorContextProvider = (props)=>{

    const backendurl = import.meta.env.VITE_BACKEND_URL

    const [dtoken,setDtoken] = useState(localStorage.getItem('dtoken')?localStorage.getItem('dtoken'):"")


    // any value added in below value can be accessed by any file using below props.children
    const value ={
        dtoken,setDtoken,backendurl
    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}


export default DoctorContextProvider