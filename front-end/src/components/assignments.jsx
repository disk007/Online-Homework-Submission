import React,{useEffect, useState} from "react";
import { Link,useLocation,useParams } from "react-router-dom";
import SidebarClassroom from "../components/sidebar-classroom";
import { GiHamburgerMenu } from "react-icons/gi";
const Assignments = ({sidebar,setSidebar}) =>{
    const [activeLink,setActiveLink] = useState('')
    const path = useLocation()
    const { classroomId } = useParams()

    useEffect(()=>{
        setActiveLink(path.pathname)
    },[path])

    return(
        <>
        {
            activeLink.includes('/assignments/all') ? (
                <div className="border-b-2 md:ml-32 ml-[6rem] flex md:py-5 py-2 items-center bg-gray-100 text-xs md:text-base sticky md:top-[4.2rem] top-[3.7rem]">
                    <div className="p-3 md:p-4"><Link to={'/assignments/all-upcomming'} className={`${activeLink === '/assignments/all-upcomming' ? 'font-medium' : ''}`}>Upcomming</Link><div className={`mt-1 h-1 transition ease-in-out delay-100 ${activeLink === '/assignments/all-upcomming' ? ' w-full bg-sky-600 rounded-sm' : ''}`}></div></div>
                    <div className="p-3 md:p-4"><Link to={'/assignments/all-past-due'} className={`${activeLink === '/assignments/all-past-due' ? 'font-medium' : ''}`}>Past due</Link><div className={`mt-1 h-1 transition ease-in-out delay-100 ${activeLink === '/assignments/all-past-due' ? '  w-full bg-sky-600 rounded-sm' : ''}`}></div></div>
                    <div className="p-3 md:p-4"><Link to={'/assignments/all-completed'} className={`${activeLink === '/assignments/all-completed' ? 'font-medium' : ''}`}>Completed</Link><div className={`mt-1 h-1 transition ease-in-out delay-100 ${activeLink === '/assignments/all-completed' ? '  w-full bg-sky-600 rounded-sm' : ''}`}></div></div>
                </div>
            ) 
            : 
            (
                <>
                    <div className={`border-b-2 ml-[6rem] md:ml-[8rem] lg:ml-[26rem] flex py-3  items-center bg-gray-100 text-xs md:text-base ${sidebar ? 'opacity-10 pointer-events-none' : ''}`}>
                        <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-3"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                        <div className="md:px-4 px-3"><Link to={`/detail-classroom/up-comming/${classroomId}`} className={`${activeLink === `/detail-classroom/up-comming/${classroomId}` ? 'font-medium' : ''}`}>Upcomming</Link><div className={`mt-0.5 h-0.5 transition ease-in-out delay-100 ${activeLink === '/detail-classroom/up-comming' ? ' w-full bg-sky-600 rounded-sm' : ''}`}></div></div>
                        <div className="md:px-4 px-3"><Link to={`/detail-classroom/past-due/${classroomId}`} className={`${activeLink === `/detail-classroom/past-due/${classroomId}` ? 'font-medium' : ''}`}>Past due</Link><div className={`mt-0.5 h-0.5 transition ease-in-out delay-100 ${activeLink === '/detail-classroom/past-due' ? '  w-full bg-sky-600 rounded-sm' : ''}`}></div></div>
                        <div className="md:px-4 px-3"><Link to={`/detail-classroom/completed/${classroomId}`} className={`${activeLink === `/detail-classroom/completed/${classroomId}` ? 'font-medium' : ''}`}>Completed</Link><div className={`mt-0.5 h-0.5 transition ease-in-out delay-100 ${activeLink === '/detail-classroom/completed' ? '  w-full bg-sky-600 rounded-sm' : ''}`}></div></div>
                    </div>
                </>   
                
            )
        }
            
            
            
        </>
    )
}

export default Assignments;