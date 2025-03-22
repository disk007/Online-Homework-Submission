import React,{useState,useEffect,useContext} from "react";
import { Link,useLocation } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUsersLine } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import {RoomContext} from "./fetchRoom";
import axios from "axios";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const Sidebar = ({isLogin}) =>{
    const path = useLocation()
    const [activeLink,setActiveLink] = useState('')
    const { dataRoom,fetchRoom } = useContext(RoomContext);
    const [countActivity, setCountActivity] = useState(null)
    useEffect(()=>{
        setActiveLink(path.pathname)
    },[path])
    const fetchCountActivity = async() => {
        try {
            let response
            if(isLogin.role === 'student') {
                response = await axios.get(`/count-activity/${isLogin.id}`)
            }
            else if(isLogin.role === 'teacher'){

                response = await axios.get(`/count-teacher-activity/${isLogin.id}`)
            }
            const responData = response.data
            setCountActivity(responData.data)
        } catch (error) {
            console.log(error)
        }
    }
    console.log('activity ',countActivity)
    useEffect(()=>{
        fetchCountActivity()
    },[])
    useEffect(() => {
        if (!isLogin?.id) return;
        if(isLogin?.role === 'student'){
            const idClassroom = dataRoom.map((data)=> data.id)
            if(idClassroom.length > 0){
                socket.emit("add-assignment",idClassroom);
                const handleActivityUpdate = (data) => {
                    console.log("Received update:");
                    fetchCountActivity(); // ✅ เรียก API เพื่อดึงข้อมูลล่าสุด
                };
            
                socket.on("activityStudent", handleActivityUpdate);
            }
            return () => {
                console.log("Leaving room:", isLogin.id);
                socket.off("activityStudent");
            };
        }
        else if(isLogin?.role === 'teacher'){
            const idClassroom = dataRoom.map((data)=> data.id)
            if(idClassroom.length > 0){
                socket.emit("send-work",idClassroom);
                const handleActivityUpdate = (data) => {
                    console.log("Received update:");
                    fetchCountActivity(); // ✅ เรียก API เพื่อดึงข้อมูลล่าสุด
                };
            
                socket.on("activity-teacher", handleActivityUpdate);
            }
            return () => {
                console.log("Leaving room:", isLogin.id);
                socket.off("activity-teacher");
            };
        }
    }, [isLogin?.id,dataRoom]);
    const update_activity = async() => {
        try {
            if(isLogin.role === 'student'){
                const formData = new FormData()
                formData.append('id_user', isLogin.id)
                const response = await axios.post('/update-status-activity',formData,{
                    headers: {'Content-Type': 'application/json'}
                })
                const responseData = response.data
                if(responseData.status ==='success') {
                    await fetchCountActivity()
                }
            }
            else if(isLogin.role === 'teacher'){
                const formData = new FormData()
                formData.append('id_user',isLogin.id)
                const response = await axios.post('/update-status-teacher-activity',formData,{
                    headers: {'Content-Type': 'application/json'}
                })
                const responseData = response.data
                if(responseData.status ==='success') {
                    await fetchCountActivity()
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    if (path.pathname === '/login' || path.pathname === '/register' || path.pathname === '/register-teacher') {
        return null;
    }
    
    if(isLogin === null){
        return 
    }
    return(
        <>
            <div className="md:w-32 border-x-2 h-screen w-24 fixed">
                <ul className="">
                    {isLogin.role !== 'admin' &&(
                        <li className={`py-4  ${activeLink.includes('/activity') ? "border-l-4 border-sky-600 text-sky-600 font-medium" : ""} transition ease-in-out delay-150 hover:bg-gray-100 hover:text-sky-600"`}>
                            <Link to={'/activity'} className="flex flex-col items-center relative" onClick={update_activity}>
                                {countActivity !== null && countActivity !== '0' && countActivity !== 0 &&
                                    <div className="absolute right-3 p-1 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-lg">
                                        {countActivity}
                                    </div>
                                }
                                <IoIosNotificationsOutline className=" md:w-10 md:h-14 w-8 h-10" />
                                <span className="text-xs md:text-base">Notification </span>
                            </Link>
                        </li>
                    )}
                    <li className={`py-4  ${activeLink === '/' || activeLink.includes('/detail-classroom') ? "border-l-4 border-sky-600 text-sky-600 font-medium transition-none" : ""} transition ease-in-out delay-150 hover:bg-gray-100 hover:text-sky-600"`}>
                        <Link to={'/'} className="flex flex-col items-center">
                            <SiGoogleclassroom className=" md:w-10 md:h-14 w-8 h-10" /> 
                            <span className="text-xs md:text-base">Classroom</span>
                        </Link>
                    </li>
                    {isLogin.role === 'admin' && (
                        <li className={`py-4  ${activeLink === '/all-members' ? "border-l-4 border-sky-600 text-sky-600 font-medium transition-none" : ""} transition ease-in-out delay-150 hover:bg-gray-100 hover:text-sky-600"`}>
                            <Link to={'/all-members'} className="flex flex-col items-center">
                                <FaUsersLine className=" md:w-10 md:h-14 w-8 h-10" /> 
                                <span className="text-xs md:text-base">Members</span>
                            </Link>
                        </li>
                    )}
                    {isLogin.role === 'student' && (
                        <li className={`py-4 ${activeLink.includes('/assignments')  ? "border-l-4 border-sky-600 text-sky-600 font-medium transition-none": ""} transition ease-in-out delay-150 hover:bg-gray-100 hover:text-sky-600`}>
                            <Link to={'/assignments/all-upcomming'} className="flex flex-col items-center">
                                <GoChecklist className=" md:w-10 md:h-14 w-8 h-10" />
                                <span className="text-xs md:text-base">Assignments</span>
                            </Link>
                        </li>
                    )}
                    
                </ul>
            </div>
            
            
        </>
    )
}

export default Sidebar;