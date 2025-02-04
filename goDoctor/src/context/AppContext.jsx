import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
// used when we used dummy data but now we are getting data from backend using getDoctorsData()
import axios from 'axios'
export const AppContext = createContext()

const AppContextProivder = (props) => {


    const currency = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)

    const value ={
        doctors,currency,token,setToken,backendUrl,
    }

    const getDoctorsData = async ()=>{

        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/list')

            if (data.success) {
            setDoctors(data.doctors)
            } else{
                console.log('erroor while ftchng doctors data in apppcontext.js frontend');
                
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(()=>{
        getDoctorsData()
    },[])

    

    

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProivder