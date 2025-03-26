import React,{useState,useContext} from "react";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { ToastContainer, toast,Slide } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {RoomContext } from "./fetchRoom";
const ModelCreat = ({OnClose,isLogin}) => {
    const {fetchRoom } = useContext(RoomContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        id: isLogin ? isLogin.id :''  
    })
    const [errors,setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleaddRoom = async (e) => {
        e.preventDefault()
        let isValid = true
        let validation = {}
        if(!formData.name.trim()){
            isValid = false
            validation.name = 'Name is required.'
        }
        if(isValid){
            const response = await axios.post('/add-classroom', formData)
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
                await fetchRoom()
                setFormData(prevData => ({ ...prevData, name: '' }));
                setErrors({})
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
    const handleClear = () => {
        setFormData(prevData => ({ ...prevData, name: '' }));
        setErrors({})
        OnClose()
    }
    return(
    <>
        <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
        <ToastContainer />
            <div className="bg-white rounded-md p-4 w-[24rem]">
                <div className="">
                    <div className="flex justify-end"><button onClick={handleClear} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button></div>
                    <div>Classroom name</div>
                    <form onSubmit={handleaddRoom}>
                        <div className="mt-2"><input type="text" className="border-2 w-full py-3 px-2" placeholder="Classroom name" name="name" id="name" value={formData.name} onChange={handleChange}/></div>
                        <div className={`h-2 ${errors.name && "text-red-500 text-xs"} `}>{errors.name}</div>
                        <div className="flex justify-end mt-2"><button className="py-2 px-8 hover:bg-sky-600 bg-sky-500 transition ease-in-out delay-150 rounded text-white">Create</button></div>
                    </form>
                </div>
            </div>
            
        </div>
    </>
    
    )
}

export default ModelCreat;