import React,{useState} from "react";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { ToastContainer, toast,Slide } from 'react-toastify';
// import {useRoom} from "./fetchRoom";
const ModelJoin = ({OnClose,isLogin}) => {
    
    const [formData, setFormData] = useState({
        code: '',
        id_student: isLogin ? isLogin.id :''  
    })
    const { dataRoom, fetchroom } = useRoom();
    const [errors,setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleJoinRoom = async (e) => {
        e.preventDefault()
        let isValid = true
        let validation = {}
        if(!formData.code.trim()){
            isValid = false
            validation.code = 'Code is required.'
        }
        if(isValid){
            const response = await axios.post('/join-classroom', formData)
            const responseData = response.data;
            if(responseData.status === 'success'){
                toast.success(responseData.text, {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                    onClose: () => {
                        OnClose()
                    }
                })
                fetchroom()
                setFormData(prevData => ({ ...prevData, code: '' }));
                setErrors({})
            }
            else if(responseData.status === 'error'){
                toast.warning(responseData.message, {
                    position: "bottom-right",
                    autoClose: 2000,
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
    const handleClear = () => {
        setFormData(prevData => ({ ...prevData, code: '' }));
        setErrors({})
        OnClose()
    }
    console.log("datax",dataRoom.length)
    return(
    <>
    
        <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
        <ToastContainer />
            <div className="bg-white rounded-md p-4">
                    <div className="">
                    <form onSubmit={handleJoinRoom}>
                        <div className="flex justify-end"><button onClick={handleClear} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button></div>
                        <div>Class code</div>
                        <div>Get your class code from your teacher and enter it here.</div>
                        <div className="mt-2"><input type="text" name="code" id="code" className="border-2 w-full py-3 px-2" placeholder="Class code" value={formData.code} onChange={handleChange} /></div>
                        <div className={`h-2 ${errors.code && "text-red-500 text-xs"} `}>{errors.code}</div>
                        <div className="flex justify-end mt-2"><button className="py-2 px-8 hover:bg-sky-600 bg-sky-500 transition ease-in-out delay-150 rounded text-white">Join</button></div>
                    </form>
                    </div>
                
                
            </div>
            
        </div>
    </>
    
    )
}

export default ModelJoin;