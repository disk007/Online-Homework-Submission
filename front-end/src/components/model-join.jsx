import React,{useState,useContext} from "react";
import { RxCross2 } from "react-icons/rx";
import axios from './axios-instance';
import { ToastContainer, toast,Slide } from 'react-toastify';
import {RoomContext } from "./fetchRoom";
import ClipLoader from "react-spinners/ClipLoader";
const ModelJoin = ({OnClose,isLogin}) => {
    
    const [formData, setFormData] = useState({
        code: '',
        id_student: isLogin ? isLogin.id :''  
    })
    const { dataRoom, fetchRoom } = useContext(RoomContext);
    const [errors,setErrors] = useState({})
    const [loadJoin,setLoadJoin] = useState(false)
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
            setLoadJoin(true)
            const response = await axios.post('/join-classroom', formData)
            const responseData = response.data;
            if(responseData.status === 'success'){
                await fetchRoom()
                toast.success(responseData.text, {
                    containerId:"navbar",
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
                setFormData(prevData => ({ ...prevData, code: '' }));
                setErrors({})
                setLoadJoin(false)
                OnClose()
            }
            else if(responseData.status === 'error'){
                toast.warning(responseData.message, {
                    containerId:"navbar",
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
    return(
    <>
    
        <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
        {/* <ToastContainer /> */}
            {loadJoin ?
                <ClipLoader size={50} color={"#fff"} />
            :
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
            }
        </div>
    </>
    
    )
}

export default ModelJoin;