/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props)=>{

    const [atoken,setAtoken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):"")
    const [doctors,setDoctors] = useState([])
    console.log('this is admin context')
    console.log(atoken)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{atoken}})

            if(data.success){
                setDoctors(data.doctors)
                console.log('doctors data from Admincontext.js');
                console.log(data.doctors);
                
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const changeAvailability = async (docId,docName) =>{

        try {

            const {data} = await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{atoken}})

            if(data.success){
                toast.success(`${docName}:${data.message}`,{position:"top-left",autoClose:2000});
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    // any value added in below value can be accessed by any file using below props.children
    const value ={
        atoken,setAtoken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,

    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}


export default AdminContextProvider