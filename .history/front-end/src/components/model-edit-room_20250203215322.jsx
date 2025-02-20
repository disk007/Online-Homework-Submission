import React,{useContext,useState} from "react";
import { RxCross2 } from "react-icons/rx";
import {RoomContext } from "./fetchRoom";
import { SiGoogleclassroom } from "react-icons/si";
import { ToastContainer, toast,Slide } from 'react-toastify';
import axios from "axios";
const ModelEditRoom = ({open,onClose,dataEdit}) => {
    const {fetchRoom} = useContext(RoomContext);
    const [name,setname] = useState({
        name: dataEdit?.name || '',
        id: dataEdit?.id ||''
    })
    const [error,setError] = useState('')
    const updateClassroom = async() => {
        try {
            let isValid = true
            if(!name.name.trim()){
                isValid = false
                setError('name is required.')
            }
            if(isValid){
                const response = await axios.post('/update-classroom',name,{
                    headers: {'Content-Type': 'application/json'}
                })
                const responseData = response.data
                if (responseData.status ==='success') {
                    await fetchRoom()
                    
                }
                else if(responseData.status === 'duplicate'){
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
                handleCancle()
            }
            
        } catch (error) {
            console.error(error)
        }
    }
    const handleCancle = () => {
        onClose()
        setError('')
    }
    return(
        <>  
            
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
            <ToastContainer />
                <div className="bg-white rounded-md w-[500px] overflow-y-auto">
                    <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                        <div className="flex items-center"><SiGoogleclassroom /><div className="ml-1">Edit Room </div></div>
                        <div onClick={handleCancle} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                    </div>
                    <div className="flex mx-4 my-2 ">
                        <div className="w-full">
                            <input type="text" name="name" id="name" className="border-2 w-full py-2 px-2 mt-1" value={name.name} onChange={(e)=>setname({...name,name:e.target.value})} />
                        </div>
                    </div>
                    {error && <div className="px-4 pb-3 text-sm text-red-500">{error}</div>}
                    <div className="flex justify-end mx-4 mb-5 ">
                        <div className="mr-2"><div className="border-2 py-2 px-8 w-full mt-3 text-gray-400 hover:text-gray-500 mr-2 transition ease-in-out delay-150 cursor-pointer" onClick={handleCancle}>Cancel</div></div>
                        <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150" onClick={updateClassroom}>Update</button></div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModelEditRoom;