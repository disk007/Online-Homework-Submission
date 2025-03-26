import React, { useState,useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdAddCall } from "react-icons/md";
import Model_number_teacher from "./model-number-teacher";
import axios from "axios";
import { ImBin } from "react-icons/im";
import { ToastContainer, toast,Slide } from 'react-toastify';
import { use } from "react";
const Model_data_number = ({open,OnClose}) => {
    const [number,setNumber] = useState('')
    const [search,setSearch] = useState('')
    const [openAdd,setOpenAdd] = useState(false)
    const [dataNumber,setDataNumber] = useState([])
    const [error,setError] = useState('')
    const handleCancel = () => {
        setNumber('')
        setError('')
        OnClose()
    }

    const fetchData = async() => {
        const response = await axios.get('data-number-teacher')
        const responseData = response.data
        setDataNumber(responseData)
    }

    useEffect(() => {
        fetchData()
    },[])
    
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
                <div className="bg-white rounded-md p-4 w-[35rem]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="px-2">Data number teacher</span>
                        </div>
                        <div className="cursor-pointer hover:bg-gray-200" onClick={handleCancel}>
                            <RxCross2 className="w-6 h-6"/>
                        </div>
                    </div>
                    <div className={`mt-3 mb-1 flex justify-between items-center `}>
                        <div className="hover:text-sky-500">
                            <button  className={`flex items-center border-2 py-1 px-7 w-full bg-sky-500 text-white border-sky-500 cursor-pointer  hover:border-sky-600 hover:bg-sky-600 transition ease-in-out delay-150`} onClick={()=>setOpenAdd(!openAdd)}><MdAddCall className="w-6 h-6" /><span className="ml-1">Add</span></button>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search ..."
                                className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-60"
                                onChange={(e) => {
                                    setSearch(e.target.value); 
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-sm inline-block mr-2"></span>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-red-500 rounded-sm inline-block mr-2"></span>
                            <span>Unavailable</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-36 overflow-y-auto mb-2">
                        <table class="table-auto w-full border-collapse border-spacing-0">
                            <thead>
                                <tr class="border-t-2 border-b-2 text-sm ">
                                    <th class="px-4 py-2 text-center ">
                                        <div className="flex items-center justify-center">
                                            <span className="mx-1">No</span> <div className="flex cursor-pointer " ></div>
                                        </div>
                                    </th>
                                    <th class="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center">
                                            <span className="mx-1">Number</span> <div className="flex cursor-pointer " ></div>
                                        </div>
                                    </th>
                                    <th class="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center">
                                            <span className="mx-1">Action</span> <div className="flex cursor-pointer " ></div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="h-8 overflow-y-auto">
                                {dataNumber.map((data,i)=>(
                                    <tr class="border-t-2 border-b-2 text-sm" key={i}>
                                        <td class="px-4 py-2 text-center">
                                            <div>{i+1}</div>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <div className={`${data.status === 'Available' ? 'text-green-500':'text-red-500'}`}>{data.number}</div>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <div><ImBin /></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {openAdd &&(
                <Model_number_teacher open={openAdd} OnClose={()=>setOpenAdd(false)} /> 
            )}
        </>
    )
}

export default Model_data_number