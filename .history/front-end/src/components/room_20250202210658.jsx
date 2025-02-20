import React,{useState,useEffect,useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineLogout } from "react-icons/md";
import {RoomContext } from "./fetchRoom";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
const Room = ({data}) =>{
    const navigate = useNavigate()
    const [open,setOpen] = useState(null)
    const [openLeave,setOpenLeave] = useState(false)
    const [selecteId,setSelecteId] = useState('')
    // const toggleLeve = (id) => {
    //     setOpenLeave((prev) => ({
    //         ...prev,
    //         [id]: !prev[id],
    //     }));
    // }
    const chooseId = (id) => {
        setSelecteId(id)
        setOpenLeave(!openLeave)
    }
    // const { dataRoom,fetchroom} = useFetchRoom(data.id,data.role);
    const { dataRoom,fetchRoom} = useContext(RoomContext);
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".dots") && open !== null && !e.target.closest(".toggle-dots")){
                setOpen(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    },[open])

    const handleLinkClick = (classroomId) =>{
        navigate(`/detail-classroom/post/${classroomId}`);
    }
    const handleMenuClick = (e,id) => {
        e.stopPropagation()
        setOpen(open === id ? null : id)
    }
    const extractFirstChars = (name) => {
        let firstEncounter = true;
        return name.split(/[\s.,-/]+/).map((part, index) => {
          if (index > 0 && !firstEncounter) {
            return ''; // ถ้าเจอครั้งที่ 2 ไม่ต้องแสดง
          } else if (index > 0) {
            firstEncounter = false; // หลังจากเจอครั้งแรกให้หยุดแสดงครั้งถัดไป
          }
          return part[0]; // แสดงตัวอักษรตัวแรกของแต่ละคำที่เจอ
        }).join('');
    }
    const handelLeave = async() => {
        try {
            const data = new FormData()
        } catch (error) {
            console.error(error);
        }
    }
    // const fetchAddRoom = async () => {
    //     const response = await axios.get(`/add-classroom/${data.id}`);
    //     const responseData = response.data; 
    //     setCreateClassroom(responseData);
    // }
    // const fetchJoinedRoom = async () => {
    //     const response = await axios.get(`/joined-classroom/${data.id}`);
    //     const responseData = response.data; 
    //     setJoinedClassroom(responseData);
    // }
    // useEffect(()=>{
    //     fetchAddRoom()
    // },[])
    // useEffect(()=>{
    //     fetchJoinedRoom()
    // },[])
    // console.log('dataRoom ',data.length)
    return(
        <>  
            <div className="md:pl-[10.5rem] py-5 pl-[8.5rem]">
                <div className="flex flex-wrap overflow-y-auto pb-5">
                    {
                        dataRoom.map((d)=>(
                        <div className="border-2 w-80 h-60 rounded-md shadow-md m-5 hover:bg-gray-100 transition ease-in-out delay-150 relative cursor-pointer" onClick={() => handleLinkClick(d.id)} key={d.id}>
                                <div className="px-4 pt-5 pb-2 h-full flex flex-col relative">
                                    <div className="flex justify-center w-full">
                                        <div className="bg-fuchsia-500 text-white p-2 flex items-center justify-center w-24 h-24 rounded-md text-4xl ">{extractFirstChars(d.name)}</div>
                                    </div>
                                    <div className="mt-5 ">
                                        <div className="flex justify-center">
                                            <div className="text-center line-clamp-2">{d.name}</div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-2">
                                        {
                                            data.role === "student" && (
                                                <div className="" onClick={()=>chooseId(d.id)}><MdOutlineLogout className="cursor-pointer w-6 h-6 hover:text-sky-500 transition ease-in-out delay-150"/></div>
                                            )
                                        }
                                        {/* <div onClick={(e)=>handleMenuClick(e,data.id)} className=""><BsThreeDots className="cursor-pointer w-6 h-6 hover:text-sky-500 transition ease-in-out delay-150 toggle-dots"/></div> */}
                                    </div>
                                </div>
                                {/* {open === data.id && (
                                    <ul className="text-sm block fixed z-[27] border-2 min-w-12 absolute right-2 -bottom-9 bg-white dots" >
                                        <li className="border-b-2 px-2 cursor-pointer hover:bg-gray-100"><Link>Leave</Link></li>
                                        <li className="px-2 cursor-pointer hover:bg-gray-100"><Link>Delete</Link></li>
                                    </ul>
                                )} */}
                        </div>
                        )) 
                    }
                    
                </div>
                
            </div>
            {
                openLeave && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setOpenLeave(!openLeave)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you want to leave classroom ?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setOpenLeave(!openLeave)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={handelLeave}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Room