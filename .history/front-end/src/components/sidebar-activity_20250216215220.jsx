import React,{useEffect,useState,useContext} from "react";
import {RoomContext} from "./fetchRoom";
import { FaBook } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import folder from '../picture//folder.jpg'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const SidebarActivity = ({sidebar,setSidebar,isLogin,setWorkId}) =>{
    const [activities, setActivities] = useState([])
    const { dataRoom,fetchRoom } = useContext(RoomContext);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate()
    const handleResize = () => {
        if(window.innerWidth >= 1024) { // 1024px is the 'lg' breakpoint in Tailwind CSS
            setSidebar(false);
        }
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".sidebar") && sidebar){
                setSidebar(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    },[sidebar])
    const formattedDate = (date) => {
        const formatted = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        });
        return formatted;
    }
    const handleWorkId = async(id,type) => {
        try {
            const formData = new FormData()
            formData.append('id_work', id)
            formData.append('id_user', isLogin.id)
            formData.append('type', type)
            const response = await axios.post(`update-activity`,formData,{
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            if(responseData.status ==='success') {
                await fetchActivity()
            }
            setWorkId(id)
            setSelectedId(id)
            setSidebar(false)
        } catch (error) {
            console.error(error)
        }
        
    }
    const LinkPageAssignment = (id,id_classroom) => {
        navigate(`/detail-classroom/detail-assignment/${id_classroom}/${id}`);
    }
    const fetchActivity = async () => {
        try {
            let response
            if(isLogin.role === 'student') {
                response = await axios.get(`/activity/${isLogin.id}`)
            }
            else if(isLogin.role === 'teacher') {
                response = await axios.get(`/activity-teacher/${isLogin.id}`)
            }
            const responseData = response.data
            setActivities(responseData)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (!isLogin?.id) return;
        if(isLogin.role === 'student'){
            const idClassroom = dataRoom.map((data)=> data.id)
            if(idClassroom.length > 0){
                socket.emit("add-assignment",idClassroom);
                const handleActivityUpdate = (data) => {
                    console.log("Received update:");
                    fetchActivity(); // ✅ เรียก API เพื่อดึงข้อมูลล่าสุด
                };
            
                socket.on("activityStudent", handleActivityUpdate);
            }
            return () => {
                console.log("Leaving room:", isLogin.id);
                socket.off("activityStudent");
            };
        }
        else if(isLogin.role === 'teacher'){
            const idClassroom = dataRoom.map((data)=> data.id)
            if(idClassroom.length > 0){
                socket.emit("send-work",idClassroom);
                const handleActivityUpdate = (data) => {
                    console.log("Received update:");
                    fetchActivity(); // ✅ เรียก API เพื่อดึงข้อมูลล่าสุด
                };
            
                socket.on("activity-teacher", handleActivityUpdate);
            }
            return () => {
                console.log("Leaving room:", isLogin.id);
                socket.off("activity-teacher");
            };
        }
    }, [isLogin.id,dataRoom]);
    console.log('dataRoom',dataRoom)
    
    // console.log("activitiesGroup ",dataRoom.map((data)=> data.id))
    // const fetchActivityGroup = async () => {
    //     try {
    //         let response
    //         if(isLogin.role === 'student') {
    //             response = await axios.get(`/activity/${isLogin.id}`)
    //         }
    //         const responseData = response.data
    //         setActivitiesGroup(responseData)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    useEffect(()=>{
        fetchActivity()
    },[])
    // useEffect(()=>{
    //     fetchActivityGroup()
    // },[])
    // const fetchActivityTeacher = async () => {
    //     try {
    //         const response = await axios.get(`/activity-teacher/${isLogin.id}`)
    //         const responseData = response.data
    //         setActivities(responseData)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // useEffect(()=>{
    //     fetchActivityTeacher()
    // },[])
    return (
        <>
        <div className=" md:ml-32 ml-[6rem] bg-white border-r-2 md:w-72 h-screen fixed hidden lg:block bg-gray-50 overflow-y-auto " >
            <div className="pl-5 text-lg font-medium border-b-2 py-3 sticky top-0 bg-gray-100">Activity</div>
            {isLogin.role === 'student' && activities.map((data,id)=> (
                <div className={`p-3 flex justify-between text-sm border-b-2 border-gray-300 cursor-pointer hover:bg-gray-100 ${data.activity == 'No' || data.activity == 'Initial' ? 'bg-gray-200': ''}  ${selectedId == data.id ? 'bg-gray-200' : ''}`} key={id} onClick={()=>handleWorkId(data.id,data.assignment_type)}>
                        <div className="mx-1"><div className="bg-sky-600 rounded p-2"><FaBook className="h-9 w-8 text-white" /></div></div>
                        <div className="mx-1 ">
                            <span className="line-clamp-2">{data.fname+' '+data.lname} added an assignment</span>
                            <span className="line-clamp-1 text-gray-500">{formattedDate(data.due_time)}</span>
                            <span className="line-clamp-2 text-xs">{data.name}</span>
                        </div>
                </div>
            ))}
            {isLogin.role === 'teacher' && activities.map((data,id)=> (
                <div className={`p-3 flex justify-between text-sm border-b-2 border-gray-300 cursor-pointer hover:bg-gray-100 ${selectedId == data.id ? 'bg-gray-300' : ''}`} key={id} onClick={()=>LinkPageAssignment(data.id_assignment,data.id_classroom)}>
                        <div className="mx-1"><div className="bg-sky-600 rounded p-2"><FaBook className="h-9 w-8 text-white" /></div></div>
                        <div className="mx-1 ">
                            <span className="line-clamp-2">{data.submissionCount+' '+data.id_group === null ? 'students':'groups'}  Added a task</span>
                            <span className="line-clamp-1 text-gray-500">{data.title}</span>
                            <span className="line-clamp-2 text-xs">{data.name}</span>
                        </div>
                </div>
            ))}
            
            {isLogin.role === 'student' && activities.length === 0 && (
                <div>
                    <div className="flex justify-center"><img className="w-32 " src={folder} alt="" /></div>
                    <div className="text-sm text-center text-gray-500 ">You don't have any activity yet.</div>
                </div>
            )}
            {isLogin.role === 'teacher' && activities.length === 0 && (
                <div className="">
                    <div className="flex justify-center"><img className="w-32 " src={folder} alt="" /></div>
                    <div className="text-sm text-center text-gray-500 ">You don't have any activity yet.</div>
                </div>
            )}
            <br />
            <br />
            <br />
            {/* <div className="text-sm text-center py-3">You don't have any notifications yet.</div> */}
        </div>

        {
            sidebar &&(
                <div className={`md:ml-32 ml-[6rem] bg-white border-r-2 w-72 h-screen fixed bg-gray-50 lg:hidden block overflow-y-auto z-40 sidebar `}>
                    <div className="px-5 text-lg font-medium border-b-2 py-3 sticky top-0 bg-gray-100 flex items-center justify-between">Activity <RxCross2 className="hover:text-sky-500 cursor-pointer hover:w-5 hover:h-5 " onClick={() => setSidebar(false)} /></div>
                    {isLogin.role === 'student' && activities.map((data,id)=> (
                        <div className={`p-3 flex justify-between text-sm border-b-2 border-gray-300  cursor-pointer hover:bg-gray-100 ${data.activity == 'No' ? 'bg-gray-200': ''} ${selectedId == data.id ? 'bg-gray-200' : ''}`} key={id} onClick={()=>handleWorkId(data.id,data.assignment_type)}>
                                <div className="mx-1"><div className="bg-sky-600 rounded p-2"><FaBook className="h-9 w-8 text-white" /></div></div>
                                <div className="mx-1 ">
                                    <span className="line-clamp-2">{data.fname+' '+data.lname} added an assignment</span>
                                    <span className="line-clamp-1 text-gray-500">{formattedDate(data.due_time)}</span>
                                    <span className="line-clamp-2 text-xs">{data.name}</span>
                                </div>
                        </div>
                    ))}
                    {isLogin.role === 'teacher' && activities.map((data,id)=> (
                        <div className={`p-3 flex justify-between text-sm border-b-2  cursor-pointer hover:bg-gray-100 ${selectedId == data.id ? 'bg-gray-200' : ''}`} key={id} onClick={()=>LinkPageAssignment(data.id_assignment,data.id_classroom)}>
                                <div className="mx-1"><div className="bg-sky-600 rounded p-2"><FaBook className="h-9 w-8 text-white" /></div></div>
                                <div className="mx-1 ">
                                    <span className="line-clamp-2">{data.submissionCount+' '+data.id_group === null ? 'students':'groups'} Added a task</span>
                                    <span className="line-clamp-1 text-gray-500">{data.title}</span>
                                    <span className="line-clamp-2 text-xs">{data.name}</span>
                                </div>
                        </div>
                    ))}
                    {isLogin.role === 'student' && activities.length === 0 && (
                        <div>
                            <div className="flex justify-center"><img className="w-32 " src={folder} alt="" /></div>
                            <div className="text-sm text-center text-gray-500 ">You don't have any activity yet.</div>
                        </div>
                    )}
                    {isLogin.role === 'teacher' && activities.length === 0 && (
                        <div className="">
                            <div className="flex justify-center"><img className="w-32 " src={folder} alt="" /></div>
                            <div className="text-sm text-center text-gray-500 ">You don't have any activity yet.</div>
                        </div>
                    )}
            
                    <br />
                    <br />
                    <br />
                    {/* <div className="text-sm text-center py-3">You don't have any notifications yet.</div> */}
                </div>
            )
        }
        </>
    )
    
}
export default SidebarActivity