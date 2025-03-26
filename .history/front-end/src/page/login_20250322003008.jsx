import React,{useEffect,useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast,Slide } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import useAuth from "../components/use-auth";
import { Navigate } from "react-router-dom";

const Login = ({isLogin}) => {
    console.log('page login ',isLogin)
    const navigate = useNavigate();
    const {isLogined,loading} = useAuth() 
    const [formData,setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors,setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const linkForgotPass = () => {
        navigate('/forgot-password');
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
            const response = await axios.post('/login', formData)
            const responseData = response.data;
            if(responseData.status === 'success'){
                window.location.href = '/';
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
    useEffect(() => {
        if (isLogin) {
            navigate('/');
        }
    }, [isLogin, navigate]);
    if (loading) {
        return <div>Loading...</div>;  // หรือทำให้หน้าว่างก่อน
    }
    if (isLogined) {
        return <Navigate to="/" />;
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
                            <input type="text" name="email" id="email" className="px-2 py-2 border-2 w-full"  value={formData.email} onChange={handleChange}/>
                            <div className={`h-2 ${errors.email && "text-red-500 text-xs"} `}>{errors.email}</div>
                        </div>
                        <div >Password</div>
                        <div className="w-full ">
                            <input type="password" name="password" id="password" className="px-2 py-2 border-2 w-full" value={formData.password} onChange={handleChange} />
                            <div className={`h-2 ${errors.password && "text-red-500 text-xs"} `}>{errors.password}</div>
                        </div>
                        <div className="flex justify-end  text-sm mb-2 hover:font-medium hover:underline hover:underline-offset-2 cursor-pointer" onClick={linkForgotPass}>Forgot password ?</div>
                        <div className="w-full mb-3"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150">Login</button></div>
                        <div className="w-full text-center">Don't have an account? <Link to={'/register'} className="font-semibold hover:text-sky-600 transition ease-in-out delay-150">Register</Link></div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Login 