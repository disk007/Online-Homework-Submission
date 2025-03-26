import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdAddCall } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast,Slide } from 'react-toastify';
const Model_data_number = ({open,OnClose}) => {
    const [number,setNumber] = useState('')
    const [error,setError] = useState('')
    const handleCancel = () => {
        setNumber('')
        setError('')
        OnClose()
    }
    const add_number = async() => {
        try {
            if(!number.trim()){
                setError('Number teacher is required.')
            }
            else if(/[^0-9]/.test(number)){
                setError('Number teacher should contain only numbers.')
            }
            else{
                const response = await axios.post('/add-number-teacher',{number},{
                    headers: {'Content-Type': 'application/json'}
                })
                const responseData = response.data
                if(responseData.state = 'success'){
                    toast.success(responseData.message, {
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
                        onClose: () => {
                            OnClose()
                        }
                    })
                    setError('')
                }
                
            }
        } catch (error) {
            console.error(error)
        }
    }
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
                <div className="bg-white rounded-md p-4 w-[30rem]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <MdAddCall className="w-6 h-6" />
                            <span className="px-2">Add number teacher</span>
                        </div>
                        <div className="cursor-pointer hover:bg-gray-200" onClick={handleCancel}>
                            <RxCross2 className="w-6 h-6"/>
                        </div>
                    </div>
                    <div className="mt-5">Enter your number teacher.</div>
                    <div className=""><input type="text" name="numberTeacher" id="numberTeacher" value={number} className="border-2 w-full py-3 px-2"  onChange={(e)=>setNumber(e.target.value)} /></div>
                    <div className={`h-2 ${error && "text-red-500 text-xs"} `}>{error}</div>
                    <div className={`mt-1 mb-1 flex justify-end`}>
                        <div className="hover:text-sky-500">
                            <button  className={`flex items-center border-2 py-2 px-8 w-full bg-sky-500 text-white border-sky-500 cursor-pointer mt-3 hover:border-sky-600 hover:bg-sky-600 transition ease-in-out delay-150`} onClick={add_number}><MdAddCall className="w-6 h-6" /><span className="ml-1">Add</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Model_data_number