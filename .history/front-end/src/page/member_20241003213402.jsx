import React,{useState} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import { RxCross2 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete,MdSortByAlpha } from "react-icons/md";
import {Navigate } from "react-router-dom";
import {FaUserFriends,FaUser} from "react-icons/fa";
const Member = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar} />
            <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                    <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><FaUserFriends className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Member</div>
                </div>
                <div className="my-5 flex flex-col lg:mx-24 md:mx-16 mx-10 ">
                    <div className="text-xl font-semibold mb-2">Teacher</div>
                    <hr className="mb-2" />
                    <div className="my-2 flex items-center"><div className="border-2 p-2 rounded-full mx-3"><FaUser className="h-5 w-5" /></div><div>2003 Witchaphon seanthawisuk</div></div>
                    <div className="mt-8 text-xl font-semibold mb-2 flex justify-between items-center"><div >Student</div><div className="text-sm font-normal">2 student</div></div>
                    <hr className="mb-2" />
                    <div className="my-3 flex items-center">
                        <div className="mx-3"><input type="checkbox" name="" id="" className="transform scale-150" /></div>
                        <div className="mx-3 grow"><button className="bg-red-600 text-white px-4 py-1 rounded-md">Delete</button></div>
                        <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"><MdSortByAlpha className="h-7 w-7" /></div>
                    </div>
                    <div className="my-2 flex items-center">
                        <div className="mx-3"><input type="checkbox" name="" id="" className="transform scale-150" /></div>
                        <div className="border-2 p-2 rounded-full mx-1"><FaUser className="h-5 w-5" /></div>
                        <div className="grow">2003 Witchaphon seanthawisuk</div>
                        <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"><MdDelete className="h-5 w-5" /></div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Member