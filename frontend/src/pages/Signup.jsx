import React from "react";
import {Link,useNavigate} from "react-router-dom"
import {useState} from "react"
import axios from "axios"



export default function Signup() {

    const [formData,setData]=useState({
        name:"",
        email:"",
        password:""
    })
    const navigate=useNavigate()

    console.log(formData)


    const handelSubmit= async (e)=>{
        e.preventDefault()

        try{
            const response= await axios.post("http://localhost:8001/api/signup",formData)
            console.log(response.data)
            if(response.data.success){
                alert("Registration Successful")
                navigate("/")
            }else{
                alert("Registration Failed")
            }
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        <>
        <div class="bg-slate-50 flex items-center md:h-screen p-4">
      <div class="w-full max-w-3xl max-md:max-w-xl mx-auto">
        <div class="bg-white w-full sm:p-8 p-6 shadow-md rounded-md overflow-hidden">
          <form class="w-full">
            <div class="mb-8">
              <h2 class="text-slate-900 text-2xl font-medium">Register</h2>
            </div>
            <div class="space-y-6">
              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">Name</label>
                <div class="relative flex items-center">
                  <input name="name" type="text" required class="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-md outline-blue-500" placeholder="Enter name" onChange={((e)=>setData({...formData,[e.target.name]:e.target.value}))} />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">Email Id</label>
                <div class="relative flex items-center">
                  <input name="email" type="email" required class="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-md outline-blue-500" placeholder="Enter email" onChange={((e)=>setData({...formData,[e.target.name]:e.target.value}))} />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4" viewBox="0 0 682.667 682.667">
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                      </clipPath>
                    </defs>
                    <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                      <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                      <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <div class="relative flex items-center">
                  <input name="password" type="password" required class="bg-white border border-slate-300 w-full text-sm text-slate-900 pl-4 pr-10 py-2.5 rounded-md outline-blue-500" placeholder="Enter password" onChange={((e)=>setData({...formData,[e.target.name]:e.target.value}))} />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-md" />
                <label for="remember-me" class="text-slate-600 ml-3 block text-sm">
                  I accept the <a href="javascript:void(0);" class="text-blue-600 font-medium hover:underline ml-1">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <div class="!mt-8">
              <button type="button"  class="w-full py-2.5 px-4 text-sm font-medium tracking-wider cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none" onClick={handelSubmit}>
                Create Account
              </button>
            </div>
            <p class="text-slate-600 text-sm mt-4 text-left">Already have an account? <Link to='/' class="text-blue-600 font-medium hover:underline ml-1">Login here</Link></p>
          </form>
        </div>
      </div>
    </div>
        </>
    )
}