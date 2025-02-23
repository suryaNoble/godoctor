import React from 'react'
import { assets } from '../../assets/assets_admin/assets'
const AdminPanel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <img src={assets.doctor_icon} alt="" />
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to <span className="text-blue-900">ADMIN</span> Panel
      </h1>
    </div>
  )
}

export default AdminPanel
