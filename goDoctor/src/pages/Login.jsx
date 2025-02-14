/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// import React from 'react'


    //this onsubmit works fine and navigates to /navigate but without any db checks for user existence
//  const onSubmit = async (data) => {
//     console.log(data);
//     try {
//         const response = await fetch("http://localhost:5000/api/user/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         });
    
//         const result = await response.json();
    
//         if (response.ok) {
//           console.log("User signed in successfully:", result.user);
//           navigate("/navbar");
//           reset();
//         } else {
//           console.error("Error siging in user:", result.error);
//           alert("invalid credentials");
//         }
//       } catch (error) {
//         console.error("Network error:", error);
//       }

//       reset();

//     };





import {useForm} from "react-hook-form"
import { useContext, useEffect, useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdEmail } from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {  RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'


const schema =yup.object().shape({
    email:yup
        .string()
        .required("please enter email")
        .email("enter valid email please!")
        .matches(/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"email cannot start with special character"),
        
    password:yup
        .string()
        .required("enter password")
        .min(6,"password is under limit")
        .matches(/^\S*$/,"No spaces allowed!")
});




const Login = () => {

    const navigate = useNavigate();


    const{
        register,
        handleSubmit,
        reset,
        formState:{errors},
    } = useForm({
        resolver:yupResolver(schema),
        mode:"onChange",
    });


    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const {backendUrl,token,setToken} = useContext(AppContext)




const onSubmit = async (formData)=>{

  

  try {

    const {data} = await axios.post('http://localhost:5000/api/user/login',formData,
      {
        headers: { "Content-Type": "application/json" }  
      })

    console.log(formData);
    console.log('login.jsx sending post request');
    
    
    

    if(data.success) {
        localStorage.setItem('userData', JSON.stringify(data.user)); // Store userData in local storage

      localStorage.setItem('token',data.token)
      setToken(data.token)
      reset()
      toast.success(data.message)
    }else{
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error)
    // res.json({success:false,message:"login failed in Login.jsc of goDoctor/pages"})
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

useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
        localStorage.setItem("token", token);
        navigate("/"); 
    }
}, []);


const [showPassword, setShowPassword] = useState(false);


//redirecting user after succesful login

useEffect(()=>{
  if(token){
    navigate('/')
  }
},[token])

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("token", token);
    navigate("/"); 
  }
}, []);


    
    return (
        <div className="w-full h-screen rounded-lg flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('/water.jpg')" }}>
          <div className="p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-3xl text-white text-center mb-6">Login</h2>
                <div className="space-y-4">
                <div className="relative">
                  <MdEmail className="absolute left-4 top-3 transform  text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    onChange={(e)=>{setEmail(e.target.value)}}
                    {...register("email")}
                    placeholder="Email"
                    className="w-full pl-12 pr-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
                  />
                  {errors.email && (<p className='text-red-800 text-sm'>{errors.email.message}</p>)}
                </div>
                  <div className="relative">
                    <input
                      type={showPassword?"text":"password"}
                      name="password"
                      onChange={(e)=>{setPassword(e.target.value)}}
                      {...register("password")}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"                    />
                  {/* <RiLockPasswordLine className="absolute right-4 top-3 text-white focus:outline-none"/> */}
                  <button type='button' onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-3 transform  text-gray-400 border-none focus:outline-none">
                    {showPassword ? <RiEyeOffFill/> : <RiEyeFill/> }
                   </button> 
                  {errors.password && (<p className='text-red-800 text-sm'>{errors.password.message}</p>)}
                  </div>
                  <div>
                    <button  type='submit' className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                      Login
                    </button>
                  </div>
                  <p className="text-center text-white mt-4">
                    Don&apos;t have an account?{' '}
                    <Link to='/register'>
                    <span className="text-blue-400 hover:underline cursor-pointer">
                      Register
                    </span>
                    </Link>
                  </p>
                </div>
              </form>
        <div className="flex items-center justify-center text-white mt-4">
            <button onClick={handleGoogleLogin} className="flex items-center space-x-2">
                <FcGoogle />
                <span>Login with Google</span>
            </button>
        </div>
            </div>
          </div>

     )
}

export default Login
