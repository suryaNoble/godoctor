/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRegUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import { toast } from "react-toastify";
import { useContext, useState } from "react";


const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name must not contain numbers or special characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be greater than 6 characters")
    .matches(/^\S*$/, "Password must not contain spaces"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords do not match"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), 
    mode: "onChange", 
  });


  const navigate = useNavigate()


  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const {backendUrl,token,setToken} = useContext(AppContext)


  useEffect(() => {
    // Check for token in URL after Google registration
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); 
    }
  }, []);


  
  const onSubmit = async (formData)=>{

    try {
  
      const {data} = await axios.post('http://localhost:5000/api/user/register',formData,
        {
          headers: { "Content-Type": "application/json" }  
        })
  
      if(data.success){
        localStorage.setItem('token',data.token)
        setToken(data.token)
        toast.success(data.message)
        navigate('/')
        reset()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      // res.json({success:false,message:"register failed in register.jsx of goDoctor/pages"})
    }
  }


const handleGoogleLogin = async () => {
    try {
        window.open(`http://localhost:5000/auth/google`, "_self");
    } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed. Please try again.");
    }
};

    

  return (
    <div
      className="w-full h-screen rounded-lg flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/water.jpg')" }}
    >
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-white text-center mb-6">Register</h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                onChange={(e)=>{setName(e.target.value)}}
                {...register("name")}
                placeholder="Name"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
              />
              <FaRegUserCircle className="absolute right-4 top-3 text-white" />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="email"
                onChange={(e)=>{setEmail(e.target.value)}}
                {...register("email")}
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
              />
              <MdEmail className="absolute right-4 top-3" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                onChange={(e)=>{setPassword(e.target.value)}}
                {...register("password")}
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
              />
              <RiLockPasswordLine className="absolute right-4 top-3 text-white" />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
              />
              <RiLockPasswordLine className="absolute right-4 top-3 text-white" />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                Register
              </button>
            </div>

            <p className="text-center text-white mt-4">
              Already a user?{" "}
              <Link to="/login">
                <span className="text-blue-400 hover:underline cursor-pointer">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </form>

        <div className="flex items-center justify-center text-white mt-4">
          <button onClick={handleGoogleLogin} className="flex items-center space-x-2">
            <FcGoogle />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
