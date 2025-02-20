import React,{useState,useEffect} from "react";
import { Link,useLocation } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { SiGoogleclassroom } from "react-icons/si";
import { GoChecklist } from "react-icons/go";
import axios from "axios";

const Sidebar = ({isLogin}) =>{
    const path = useLocation()
    const [activeLink,setActiveLink] = useState('')
    const [countActivity, setCountActivity] = useState('0')
    useEffect(()=>{
        setActiveLink(path.pathname)
    },[path])
    const fetchCountActivity = async() => {
        try {
            let response
            if(isLogin.role === 'student') {
                response = await axios.get(`/count-activity/${isLogin.id}`)
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
    if (path.pathname === '/login' || path.pathname === '/register' || path.pathname === '/register-teacher') {
        return null;
    }
    
    if(isLogin === null){
        return null
    }
    return(
        <>
            <div className="md:w-32 border-x-2 h-screen w-24 fixed">
                <ul className="">
                    <li className={`py-4  ${activeLink.includes('/activity') ? "border-l-4 border-sky-600 text-sky-600 font-medium" : ""} transition ease-in-out delay-150 hover:bg-gray-100 hover:text-sky-600"`}>
                        <Link to={'/activity'} className="flex flex-col items-center absolute">
                            {countActivity !== '0' &&
                                <div className=""></div>
                            }
                            <IoIosNotificationsOutline className=" md:w-10 md:h-14 w-8 h-10" />
                            <span className="text-xs md:text-base">Notification {countActivity}</span>
                        </Link>
                    </li>
                    <li className={`py-4  ${activeLink === '/' || activeLink.includes('/detail-classroom') ? "border-l-4 border-sky-600 text-sky-600 font-medium transition-none" : ""} transition ease-in-out delay-150 hover:bg-gray-100 hover:text-sky-600"`}>
                        <Link to={'/'} className="flex flex-col items-center">
                            <SiGoogleclassroom className=" md:w-10 md:h-14 w-8 h-10" /> 
                            <span className="text-xs md:text-base">Classroom</span>
                        </Link>
                    </li>
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