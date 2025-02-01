/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext } from "react";

export const DoctorContext = createContext()

const DoctorContextProvider = (props)=>{

    // any value added in below value can be accessed by any file using below props.children
    const value ={

    }

    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}


export default DoctorContextProvider