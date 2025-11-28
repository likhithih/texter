import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // use the preconfigured axios instance

export default function Signup() {
  const [formData, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Signup request using axiosInstance");
      const response = await axiosInstance.post("/api/signup", formData);
      console.log(response.data);
      if (response.data.success) {
        alert("Registration Successful");
        navigate("/");
      } else {
        alert("Registration Failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        console.error("Response error data:", err.response.data);
        console.error("Response status:", err.response.status);
      } else if (err.request) {
        console.error("No response received, request:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      alert("Registration failed — check console for more details");
    }
  };

  return (
    <div className="bg-slate-50 flex items-center md:h-screen p-4">
      <div className="w-full max-w-3xl max-md:max-w-xl mx-auto">
        <div className="bg-white w-full sm:p-8 p-6 shadow-md rounded-md overflow-hidden">
          <form className="w-full">
            <div className="mb-8">
              <h2 className="text-slate-900 text-2xl font-medium">Register</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter name"
                  onChange={(e) => setData({ ...formData, [e.target.name]: e.target.value })}
                />
              </div>
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Email Id</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter email"
                  onChange={(e) => setData({ ...formData, [e.target.name]: e.target.value })}
                />
              </div>
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                  placeholder="Enter password"
                  onChange={(e) => setData({ ...formData, [e.target.name]: e.target.value })}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-md"
                />
                <label htmlFor="remember-me" className="text-slate-600 ml-3 block text-sm">
                  I accept the{" "}
                  <a href="javascript:void(0);" className="text-blue-600 font-medium hover:underline ml-1">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="button"
                className="w-full py-2.5 px-4 text-sm font-medium tracking-wider cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
                onClick={handelSubmit}
              >
                Create Account
              </button>
            </div>
            <p className="text-slate-600 text-sm mt-4 text-left">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 font-medium hover:underline ml-1">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
