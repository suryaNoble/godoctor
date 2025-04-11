import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRegUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiEyeFill, RiEyeOffFill, RiSunLine, RiMoonLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { useContext, useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Name must not contain numbers or special characters"
    ),
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

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [navigate, token]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Registered successfully");
        navigate("/");
        reset();
      } else {
        toast.error("Registration failed!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.open(`${backendUrl}/auth/google`, "_self");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center transition-colors ${
        darkMode ? "bg-gray-900" : "bg-blue-50"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-xl transition-all ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Create Account
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {darkMode ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Full Name
            </label>
            <div className="relative">
              <FaRegUserCircle
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                }`}
              />
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                {...register("name")}
                placeholder="Full Name"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <div className="relative">
              <MdEmail
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                }`}
              />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                {...register("email")}
                placeholder="your@email.com"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                }`}
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                {...register("password")}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                }`}
              >
                {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <div className="flex items-center my-6">
            <div
              className={`flex-grow h-px ${
                darkMode ? "bg-gray-600" : "bg-gray-200"
              }`}
            ></div>
            <span
              className={`px-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              OR
            </span>
            <div
              className={`flex-grow h-px ${
                darkMode ? "bg-gray-600" : "bg-gray-200"
              }`}
            ></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 border transition ${
              darkMode
                ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <FcGoogle size={20} />
            <span className={darkMode ? "text-white" : "text-gray-700"}>
              Continue with Google
            </span>
          </button>

          <p
            className={`text-center mt-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className={`font-medium hover:underline ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
