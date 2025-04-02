/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import "../index.css";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAtoken, backendUrl } = useContext(AdminContext);
  const { setDtoken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (state == "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          console.log(data);
          console.log(data.atoken);
          localStorage.setItem("atoken", data.atoken);
          setAtoken(data.atoken);
          toast.success("Login Succesfull", {
            autoClose: 3000,
            position: "top-center",
          });
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dtoken", data.token);
          setDtoken(data.token);
          toast.success("Login Succesfull", {
            autoClose: 3000,
            position: "top-center",
          });
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col border-none bg-gray-100 gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-700 text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto ">
          <span className="text-primary">{state} </span>Login
        </p>
        <div className="w-full">
          <p className="text-primary">Email</p>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p className="text-primary">Password</p>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="assword"
            required
          />
        </div>
        <button className="bg-primary cursor-pointer text-white w-full  py-2 rounded-md text-base">
          {loading ? (
            <div className="flex justify-center items-center">
              <AiOutlineLoading3Quarters className="animate-spin size-4 text-4xl text-blue-500" />
              <p className="ml-2 text-white">Signing in...</p>
            </div>
          ) : (
            "Login"
          )}
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => {
                setState("Doctor");
              }}
              className="text-primary hover:underline cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => {
                setState("Admin");
              }}
              className="text-primary hover:underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
