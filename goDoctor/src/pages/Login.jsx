import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdEmail } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiEyeFill, RiEyeOffFill, RiSunLine, RiMoonLine } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("please enter email")
    .email("enter valid email please!")
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "email cannot start with special character"
    ),

  password: yup
    .string()
    .required("enter password")
    .min(6, "password is under limit")
    .matches(/^\S*$/, "No spaces allowed!"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setToken(data.token);
        reset();
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("invalid credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials. Please try again.");
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      toast.error("Google login failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      const from = location.state?.from?.pathname || "/";
      navigate("/");
    }
  }, [navigate, setToken, token]);

  const [showPassword, setShowPassword] = useState(false);

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
            Login
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <MdEmail
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-blue-300" : "text-blue-500"
                }`}
              />
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                {...register("email")}
                placeholder="Email"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
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
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                {...register("password")}
                placeholder="Password"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
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
                Signing in...
              </>
            ) : (
              "Login"
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
              Login with Google
            </span>
          </button>

          <p
            className={`text-center mt-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`font-medium hover:underline ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
              onClick={() => window.scrollTo(0, 0)}
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
