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
    
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
                <div className="bg-white rounded-md p-4 w-[30rem]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="px-2">Data number teacher</span>
                        </div>
                        <div className="cursor-pointer hover:bg-gray-200" onClick={handleCancel}>
                            <RxCross2 className="w-6 h-6"/>
                        </div>
                    </div>
                    <div className={`mt-1 mb-1 flex justify-between`}>
                        <div className="hover:text-sky-500">
                            <button  className={`flex items-center border-2 py-1 px-7 w-full bg-sky-500 text-white border-sky-500 cursor-pointer mt-3 hover:border-sky-600 hover:bg-sky-600 transition ease-in-out delay-150`} ><MdAddCall className="w-6 h-6" /><span className="ml-1">Add</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Model_data_number