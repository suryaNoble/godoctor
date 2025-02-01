/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AdminContext = createContext()

const AdminContextProvider = (props)=>{

    const [atoken,setAtoken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):"")
    console.log('this is admin context')
    console.log(atoken)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // any value added in below value can be accessed by any file using below props.children
    const value ={
        atoken,setAtoken,
        backendUrl,

    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}


export default AdminContextProvider