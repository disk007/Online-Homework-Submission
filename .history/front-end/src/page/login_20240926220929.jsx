import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast,Slide } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors,setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        let isValid = true
        let validation = {}
        if(!formData.email.trim()){
            isValid = false
            validation.email = 'Email is required.'
        }
        if(!formData.password.trim()){
            isValid = false
            validation.password = 'Password is required.'
        }
        if(isValid){
            const response = await axios.post('/register-teacher', formData)
            const responseData = response.data;
            if(responseData.status === 'success'){
                toast.success('Register successfully!', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                    onClose: () => navigate('/login'),
                })
            }
            else if(responseData.status === 'error'){
                toast.warning(responseData.message, {
                    position: "bottom-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
            setErrors({})
        }
        else{
            setErrors(validation)
        }
    }
    return(
        <>
            <div className="fixed inset-0 flex justify-center items-center">
            <ToastContainer/>
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
                    <form onSubmit={handleSubmit}>
                        <div className="text-4xl font-semibold text-center mb-5">Login</div>
                        <div>Email</div>
                        <div className="w-full mb-2">
                            <input type="text" name="" id="" className="px-2 py-2 border-2 w-full" />
                            <div className={`h-2 ${errors.email && "text-red-500 text-xs"} `}>{errors.email}</div>
                        </div>
                        <div >Password</div>
                        <div className="w-full mb-3">
                            <input type="password" name="" id="" className="px-2 py-2 border-2 w-full" />
                            <div className={`h-2 ${errors.password && "text-red-500 text-xs"} `}>{errors.password}</div>
                        </div>
                        <div className="w-full mb-3"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150">Login</button></div>
                        <div className="w-full text-center">Don't have an account? <Link to={'/register'} className="font-semibold hover:text-sky-600 transition ease-in-out delay-150">Register</Link></div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Login 