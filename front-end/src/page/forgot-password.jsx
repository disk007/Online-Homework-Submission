import axios from '../components/axios-instance';
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast,Slide } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";

const ForgotPassword = () => {
    const navigate = useNavigate(); 
    const [email,setEmail] = useState('')
    const [error,setError] = useState('')
    const [loading, setLoading] = useState(false);
    const sendEmail = async () => {
        try {
            if(!email.trim()){
                setError('Email is required.')
            }
            else if(!/\S+@\S+\.\S+/.test(email)){
                setError('Email is not valid.')
            }
            else{
                setError('')
                setLoading(true);
                const formData = new FormData()
                formData.append('email', email)
                const response = await axios.post('/forgot-password',formData,{
                    headers: {'Content-Type': 'application/json'}
                })
                const responseData = response.data
                if (responseData.status ==='success') {
                    toast.success(responseData.message, {
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
                    setEmail('')
                }
                else if(responseData.status === 'notFound'){
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
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again later.');
        }
        finally {
            setLoading(false); // ซ่อน ClipLoader เมื่อส่งเสร็จ
        }
    }
    return(
        <>
            <ToastContainer />
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
                    <div className="text-2xl font-semibold mb-5">Forgot password</div>
                    <div>Email</div>
                    <div className="w-full mb-3">
                        <input type="text" name="email" id="email" className="px-2 py-2 border-2 w-full"  value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <div className={`h-2 ${error && "text-red-500 text-xs"} `}>{error}</div>
                    </div>
                    <div className="w-full mb-2">
                        <button
                            className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150 flex items-center justify-center"
                            onClick={sendEmail}
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;