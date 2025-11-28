
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import{lazy,Suspense} from "react"

const Login=lazy(()=>import ("./pages/Login.jsx"))
const Signup=lazy(()=>import("./pages/Signup.jsx"))
const Home=lazy(()=>import("./pages/Home.jsx"))
function App() {


  return (
   <>
    <BrowserRouter>

    <Suspense fallback={<div>Loading...</div>}>

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home/>} />
    </Routes>

    </Suspense>

    </BrowserRouter>
   </>
  )
}

export default App
