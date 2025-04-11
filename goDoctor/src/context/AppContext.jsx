/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets_frontend/assets";
// used when we used dummy data but now we are getting data from backend using getDoctorsData()
import axios from "axios";
export const AppContext = createContext();

const AppContextProivder = (props) => {
  const currency = "₹";
  const backendUrl = "https://godoctor-backend.onrender.com";
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (token) {
        await loadUserProfileData();
      } else {
        setUserData(false);
      }
      setInitializing(false);
    };
    init();
  }, [token]);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        console.log(
          "erroor while ftchng doctors data in apppcontext.js frontend"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    doctors,
    currency,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    getDoctorsData,
    initializing,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProivder;
