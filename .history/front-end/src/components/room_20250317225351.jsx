import React,{useState,useEffect,useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineLogout } from "react-icons/md";
import {RoomContext } from "./fetchRoom";
import { BsThreeDots } from "react-icons/bs";
import ModelEditRoom from "./model-edit-room";
import axios from "axios";
const Room = ({data}) =>{
    const navigate = useNavigate()
    const [openEdit,setOpenEdit] = useState(false)
    const [openLeave,setOpenLeave] = useState(false)
    const [search,setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 6;
    const [selecteId,setSelecteId] = useState('')
    const [dataEdit,setDataEdit] = useState({
        id:'',
        name:''
    })
    const [editDel,setEditDel] = useState({})
    const toggleEditDel = (e,id) => {
        e.stopPropagation()
        setEditDel((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }
    const chooseId = (e,id) => {
        e.stopPropagation()
        setSelecteId(id)
        setOpenLeave(!openLeave)
    }
    const selectDataEdit = (e,id,data) => {
        e.stopPropagation()
        setDataEdit({id:id,name:data})
        setOpenEdit(!openEdit)
    }
    const { dataRoom,fetchRoom} = useContext(RoomContext);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".post-editDel")) {
                setEditDel((prev) => (Object.keys(prev).length ? {} : prev));
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLinkClick = (classroomId) =>{
        navigate(`/detail-classroom/post/${classroomId}`);
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
            const forData = new FormData()
            forData.append('id_classroom', selecteId)
            forData.append('id_user',data.id)
            const response = await axios.post('/leave-classroom',forData,{
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            if (responseData.status ==='success') {
                await fetchRoom()
                setOpenLeave(false)
                setSelecteId('')
            }
        } catch (error) {
            console.error(error);
        }
    }
    const filteredRooms = dataRoom.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
    const startIndex = (currentPage - 1) * roomsPerPage;
    const currentRooms = filteredRooms.slice(startIndex, startIndex + roomsPerPage);
    const generatePageNumbers = () => {
        let pages = [1];
        if (totalPages > 1) {
            if (currentPage > 3) pages.push("...");
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            if (totalPages > 1) pages.push(totalPages);
        }
        return pages;
    };
    return(
        <>  
            {openEdit &&
                <ModelEditRoom open={openEdit} onClose={()=>setOpenEdit(false)} dataEdit={dataEdit} />
            }
            {data.role === 'admin' && 
                    <div className="flex ml-5">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search ..."
                            className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64"
                            onChange={(e) => {
                                setSearch(e.target.value);
                                // setCurrentPage(1); 
                            }}
                        />
                    </div>
            }
            <div className="md:pl-[10.5rem] py-5 pl-[8.5rem]">
                <div className="flex flex-wrap overflow-y-auto pb-5">
                    {
                        data.role !== 'admin' && dataRoom.map((d)=>(
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
                                                <div className="" onClick={(e)=>chooseId(e,d.id)}><MdOutlineLogout className="cursor-pointer w-6 h-6 hover:text-sky-500 transition ease-in-out delay-150"/></div>
                                            )
                                        }
                                        {
                                             data.role === "teacher" && (
                                                <div onClick={(e)=>toggleEditDel(e,d.id)} className=""><BsThreeDots className="cursor-pointer w-6 h-6 hover:text-sky-500 transition ease-in-out delay-150 toggle-dots"/></div> 
                                            )
                                        }
                                    </div>
                                </div>
                                {
                                    editDel[d.id] && (
                                        <div className="text-xs block fixed z-[27] border-2 min-w-12 absolute -right-6 -bottom-8 bg-white post-editDel">
                                            <div className="border-b-2 px-2 cursor-pointer hover:bg-gray-100" onClick={(e)=>selectDataEdit(e,d.id,d.name)}>Edit</div>
                                            <div className="px-2 cursor-pointer hover:bg-gray-100" >Delete</div>
                                        </div>
                                    )
                                }
                        </div>
                        )) 
                    }
                    {
                        data.role == 'admin' && currentRooms.map((d)=>(
                        
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
                                    <div onClick={(e)=>toggleEditDel(e,d.id)} className=""><BsThreeDots className="cursor-pointer w-6 h-6 hover:text-sky-500 transition ease-in-out delay-150 toggle-dots"/></div> 
                                       
                                </div>
                            </div>
                            {
                                editDel[d.id] && (
                                    <div className="text-xs block fixed z-[27] border-2 min-w-12 absolute -right-6 -bottom-8 bg-white post-editDel">
                                        <div className="border-b-2 px-2 cursor-pointer hover:bg-gray-100" onClick={(e)=>selectDataEdit(e,d.id,d.name)}>Edit</div>
                                        <div className="px-2 cursor-pointer hover:bg-gray-100" >Delete</div>
                                    </div>
                                )
                            }
                        </div>
                        )) 
                    }
                </div>
                {data.role === 'admin' && totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2 mr-5">
                        {currentPage > 1 && (
                            <button
                                className="px-4 py-2 border rounded-md bg-gray-300"
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                &laquo;
                            </button>
                        )}
                        {generatePageNumbers().map((page, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 border rounded-md ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                onClick={() => typeof page === "number" && setCurrentPage(page)}
                                disabled={page === "..."}
                            >
                                {page}
                            </button>
                        ))}

                        {currentPage < totalPages && (
                            <button
                                className="px-4 py-2 border rounded-md bg-gray-300"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                &raquo;
                            </button>
                        )}
                    </div>
                )}
                
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