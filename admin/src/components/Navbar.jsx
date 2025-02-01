/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const {atoken,setAtoken} = useContext(AdminContext)

    const logout = ()=>{
        navigate('/')
        atoken && setAtoken('')
        atoken && localStorage.removeItem('atoken')
    }

    const navigate = useNavigate()


  return (
    <div  className='flex justify-between items-center border-b px-4 sm:px-10 py-3 bg-white' >
      <div className='flex items-center gap-2 text-xs' >
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo2} alt="admin_svglogo" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600' >{atoken?'Admin':'Doctor'}</p>
      </div>
      <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full' >Logout</button>
    </div>
  )
}

export default Navbar
