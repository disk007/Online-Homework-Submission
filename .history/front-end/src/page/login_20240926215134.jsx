import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";

const Login = () => {
    return(
        <>
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
                    <div className="text-4xl font-semibold text-center mb-5">Login</div>
                    <div>Username</div>
                    <div className="w-full mb-2"><input type="text" name="" id="" className="px-2 py-2 border-2 w-full" /></div>
                    <div>Password</div>
                    <div className="w-full mb-3"><input type="password" name="" id="" className="px-2 py-2 border-2 w-full" /></div>
                    <div className="w-full mb-3"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150">Login</button></div>
                    <div className="w-full text-center">Don't have an account? <Link to={'/register'} className="font-semibold hover:text-sky-600 transition ease-in-out delay-150">Register</Link></div>
                </div>
            </div>

        </>
    )
}

export default Login 