import React, { useState } from 'react'
import {Link,useNavigate} from "react-router-dom"
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function Login(){

    const [formData,setData]=useState({
        email:"",
        password:""
    })
    const navigate=useNavigate();

    const handelSubmit= async (e)=>{
        e.preventDefault();
         try{
        console.log('Login backend URL: ', BACKEND_URL)
        const response=await axios.post(`${BACKEND_URL}/api/login`,formData,{
          withCredentials: true
        });
            if(response.data.success){
              // Save user and token to localStorage
              localStorage.setItem('user', JSON.stringify(response.data.user))
              if(response.data.token) localStorage.setItem('token', response.data.token)
              alert("Login Successful");
              navigate("/home");
            }else{
                alert("Login Failed");
            }
         }
         catch(err){
          // show detailed error info
          console.error('Login error:', err);
          if (err.response) {
            console.error('Response error data:', err.response.data)
            console.error('Response status:', err.response.status)
          } else if (err.request) {
            console.error('No response received, request:', err.request)
          } else {
            console.error('Error message:', err.message)
          }
          alert('Login failed — check console for more details');
         }
    }
    return(
        <>
            <div class="lg:min-h-screen flex fle-col items-center justify-center p-6">
      <div class="grid lg:grid-cols-2 items-center gap-10 max-w-6xl max-lg:max-w-lg w-full">
        <div>
          <h1 class="lg:text-5xl text-4xl font-bold text-slate-900 leading-tight!">
            Hey there !! 
          </h1>
          <p class="text-[15px] mt-6 text-slate-600 leading-relaxed">Wanna text with<span class="text-blue-600 font-medium text-xl"> LIKHITH ??</span>  got ya</p>
          <p class="text-[15px] mb-[-12] lg:mt-5 text-slate-600">Don't have an account <Link to='/signup' class="text-blue-600 font-medium hover:underline ml-1">Register here</Link></p>
        </div>

        <form class="max-w-md lg:ml-auto w-full">
          <h2 class="text-slate-900 text-3xl font-semibold mb-8">
            LOG IN
          </h2>

          <div class="space-y-6">
            <div>
              <label class='text-sm text-slate-900 font-medium mb-2 block'>Email</label>
              <input name="email" type="email" required class="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent" placeholder="Enter Email" onChange={(e)=>setData({...formData,[e.target.name]:e.target.value})} />
            </div>
            <div>
              <label class='text-sm text-slate-900 font-medium mb-2 block'>Password</label>
              <input name="password" type="password" required class="bg-slate-100 w-full text-sm text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-blue-600 focus:bg-transparent" placeholder="Enter Password" onChange={(e)=>setData({...formData,[e.target.name]:e.target.value})} />
            </div>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                <label for="remember-me" class="ml-3 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>
             
            </div>
          </div>

          <div class="mt-12!">
            <button type="button" class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer" onClick={handelSubmit}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
        </>
    )
}
export default Login