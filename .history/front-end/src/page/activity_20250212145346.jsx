import React,{useState} from "react";
import Work_sheet from "../components/work-sheet";
import {Navigate } from "react-router-dom";
import SidebarActivity from "../components/sidebar-activity";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBook,FaPlus,FaFileAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import clipboard from "../picture/clipboard.jpg"
import {RoomProvider} from "../components/fetchRoom";
import io from "socket.io-client";

const Activity = ({isLogin}) =>{
    const [sidebar,setSidebar] = useState(false)
    const [workId,setWorkId] = useState(null)
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    console.log("workId ",workId)
    return(
        <>
            {/* <Navbar />
            <Sidebar /> */}
            <SidebarActivity sidebar={sidebar} setSidebar={setSidebar} isLogin={isLogin} setWorkId={setWorkId} />
            {isLogin.role === 'student' && 
                <Work_sheet isLogin={isLogin} workId={workId} sidebar={sidebar} setSidebar={setSidebar} />
            }
            {isLogin.role === 'teacher' &&
                <>
                <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] ${sidebar ? 'opacity-10 pointer-events-none ': ''} `}>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)}><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><FaBook className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Assignments</div>
                </div>
                <div className="flex justify-center mt-8"><img className="w-32 md:w-48" src={clipboard} alt="" /></div>
                <div className="text-center text-gray-500">Please select an activity</div>
                </div>
                </>
            }
            
        </>
    )
}

export default Activity;