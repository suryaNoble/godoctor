/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import './index.css'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AppContext } from './context/AppContext';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import DoctorsList from './pages/Admin/DoctorsList';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const {atoken} = useContext(AdminContext)
  const {dtoken} = useContext(DoctorContext)


  return atoken || dtoken ? (
    <div className='bg-[#F8F9Fd]' >
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start' >
        <Sidebar/>
        <Routes>
          {/* Admin routes */}
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/doctors-list' element={<DoctorsList/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>

        </Routes>
      </div>
    </div>
  ) : (
    <>
     <Login />
     <ToastContainer/>
    </>
  )
}

export default App
