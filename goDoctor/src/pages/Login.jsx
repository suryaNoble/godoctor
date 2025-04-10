import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdEmail } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
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
      } else {
        toast.error("login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("login failed ");
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
      navigate("/");
    }
  }, [navigate, setToken]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="w-full h-screen rounded-lg flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/water.jpg')" }}
    >
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-white text-center mb-6">Login</h2>
          <div className="space-y-4">
            <div className="relative">
              <MdEmail className="absolute left-4 top-3 transform  text-gray-400" />
              <input
                type="email"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                {...register("email")}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-800 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                {...register("password")}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-2 bg-gray-800 text-white rounded-full border-none focus:outline-none"
              />
              {/* <RiLockPasswordLine className="absolute right-4 top-3 text-white focus:outline-none"/> */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-3 transform  text-gray-400 border-none focus:outline-none"
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
              {errors.password && (
                <p className="text-red-800 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <AiOutlineLoading3Quarters className="animate-spin size-4 text-4xl text-white" />
                    <p className="ml-2 text-white">Signing in...</p>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
            <p className="text-center text-white mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/register">
                <span className="text-blue-400 hover:underline cursor-pointer">
                  Register
                </span>
              </Link>
            </p>
          </div>
        </form>
        <div className="flex items-center justify-center text-white mt-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center space-x-2"
          >
            <FcGoogle />
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
