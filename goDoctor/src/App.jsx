/* eslint-disable no-unused-vars */
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import DoctorProfile from "./pages/DoctorProfile";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Space from "./pages/Space";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Toaster position="top-center" richColors />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/doctorprofile/:id" element={<DoctorProfile />} />
        <Route path="/doctorprofile" element={<DoctorProfile />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<Space />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
