/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [dtoken, setDtoken] = useState(
    localStorage.getItem("dtoken") ? localStorage.getItem("dtoken") : ""
  );

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData,setProfileData] = useState(false)



  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendurl + "/api/doctor/appointments",
        { headers: { dtoken } }
      );
      console.log(data);
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dtoken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
        console.log("doctor context lo ");
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dtoken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
        console.log("doctorontextlo unnam");
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/doctor/dashboard", {
        headers: { dtoken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };




  const getProfileData = async ()=>{
    try {
        const {data} = await axios.get(backendurl + "/api/doctor/profile", {headers:{dtoken}})
        if(data.success){
            setProfileData(data.profileData)
            console.log(data.profileData);
            }else{
                toast.error(data.message)
            }
    } catch (error) {
        console.log(error);
      toast.error(error.message);
    }
  }

  const value = {
    dtoken,
    setDtoken,
    backendurl,
    setAppointments,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
