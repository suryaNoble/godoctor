//  import React from 'react'
import { Link,useLocation, NavLink, useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets_frontend/assets'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

 const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu,setShowMenu] = useState(false)
  const [dropDown,setDropDown] = useState(false)

  const{token,setToken,userData,setUserData } = useContext(AppContext)

  const logout = ()=>{
    setToken(false)
    localStorage.removeItem('token')
    localStorage.removeItem('userData')

  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // Store in localStorage
      setToken(token); // Update React state
      navigate("/"); // Redirect to the homepage (removes token from URL)
    }
  }, [location, navigate, setToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user); // Set user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, setUserData]);

   return (
    //  <div className="text-primary">Navbar</div>
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-500'>
      <Link to={'/'}>
        <div className='flex gap-3 items-center cursor-pointer'>
        <img src={assets.logo} alt="" className='h-10 w-15 rounded-full'/>
        <div className='text-primary font-extrabold text-3xl'>goDoctor</div>
      </div>  
      </Link>
        <ul className=' hidden md:flex items-start gap-5 font-medium'>
          <NavLink to='/'>
            <li className='py-1' >Home</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
          </NavLink>

          <NavLink to='/doctors'>
            <li className='py-1'>Doctors</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
          </NavLink>

          <NavLink to='/about'>
            <li className='py-1'>About</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
          </NavLink>

          <NavLink to='/contact'>
            <li className='py-1'>Contact-Us</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
          </NavLink>

        </ul>
        <div className='flex items-center gap-4'>
          {
            token && userData
            ?<div className='flex items-center group relative gap-2 cursor-pointer'
                  onMouseEnter={()=>setDropDown(true)}
                  onMouseLeave={()=>setDropDown(false)}
                  >
              <img className='w-8 rounded-full' src={userData.image} alt="dp" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="dropdown" />
              
              { dropDown && <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'
                                  onClick={(e)=>e.stopPropagation()}
                                  >
                <div className='min-w-48 bg-stone-200 rounded flex flex-col gap-4 p-4'>
                  <p onClick={()=>{navigate('/profile');setDropDown(false)}} className='hover:text-primary cursor-pointer'>My profile</p>
                  <p onClick={()=>{navigate('/my-appointments');setDropDown(false)}} className='hover:text-primary cursor-pointer'>My appointments</p>
                  <Link to={'/'}>
                  <p onClick={()=>{logout();setDropDown(false)}} className='hover:text-primary cursor-pointer'>Logout</p>
                  </Link>
                </div>
              </div>
              }
            </div>
            :<button onClick={()=>navigate('/register')} className='px-6 py-3 text-white bg-primary rounded-full font-light hidden md:block hover:underline'>Create Account</button>

          }

          {/* menu for smaller screens problem zone */}

          <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

            <div className={` ${showMenu? 'fixed w-full' : ' h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`} >
              <div className='flex items-center justify-between px-5 py-6' >
                <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
              </div>
              <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium' >
                <NavLink  onClick={()=>{setShowMenu(false)}}  to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                <NavLink  onClick={()=>{setShowMenu(false)}} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                <NavLink  onClick={()=>{setShowMenu(false)}} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                <NavLink  onClick={()=>{setShowMenu(false)}} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact Us</p></NavLink>

              </ul>
            </div>
        
       
        
        </div>
    </div>
   )
 }
 
 export default Navbar