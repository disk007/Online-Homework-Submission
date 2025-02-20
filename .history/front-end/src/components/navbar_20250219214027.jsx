import React,{useState,useEffect,useRef} from "react";
import { Link } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { FaPlus,FaUserFriends } from "react-icons/fa";
import ModelJoin from "./model-join";
import ModelCreat from "./model-creat";
import axios from "axios";
import { useLocation} from "react-router-dom";
import {Navigate } from "react-router-dom";
import {RoomProvider} from "./fetchRoom";
import { RxCross2 } from "react-icons/rx";

const Navbar = ({isLogin}) =>{
    const [open,setOpen] = useState(false)
    const [btnPlus,setBtnPlus] = useState(false)
    const [openJoin,setOpenJoin] = useState(false)
    const [openCreat,setOpenCreat] = useState(false)
    const [openProfile,setOpenProfile] = useState(false)
    const location = useLocation();

    const handleLogout = async () => {
        try {
          await axios.post('/logout', {}, { withCredentials: true });
          window.location.href = '/login'; // บังคับเปลี่ยนไปหน้า login ทันที
        } catch (error) {
          console.error('Error logging out:', error);
        }
    };

    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".logout") && open && !e.target.closest(".toggle-button")){
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    },[open])
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".plus") && btnPlus && !e.target.closest(".toggle-plus")){
                setBtnPlus(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    },[btnPlus])

    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/register-teacher') {
        return null;
    }
    if(isLogin === null){
        return
    }
    return(
        <>
            <div className="sticky top-0 bg-white z-[27]">
                <div className="flex justify-between border-2 text-xl font-light leading-loose md:text-2xl md:leading-loose md:font-normal bg-white">
                    <div className="p-2 px-4"><Link>DP classroom</Link></div>

                    <div className="p-2 px-4 flex items-center justify-center">
                        <button className={`${btnPlus == true ? "text-sky-500 border-sky-500":""} py-[10px] hover:text-sky-500 transition ease-in-out delay-150 mx-1 toggle-plus`} onClick={()=> {setBtnPlus(!btnPlus);  }} ><FaPlus className="w-10 w-10" /></button>
                        <button className={`${open == true ? "text-sky-500 border-sky-500":""}  py-[10px] hover:text-sky-500 transition ease-in-out delay-150 mx-1 toggle-button`}  onClick={() => {setOpen(!open); }}><FaUser className="w-10 w-10" /></button>
                    </div>
                    {/* <div>{isLogin.role}</div> */}
                </div>
            </div>
        
            {
                open && (
                    <div className={`block fixed z-50 border-2 min-w-10 text-sm right-0 bg-white md:top-[65px] top-[57px] rounded-md font-light logout `}>
                        <div className="py-4 px-4 border-b-2">
                            <div className="cursor-pointer flex items-center hover:text-sky-500 hover:border-sky-500 transition ease-in-out delay-150" onClick={()=>setOpenProfile(!openProfile)}>
                                <FaUser/>
                                <span className="px-2">Profile</span>
                            </div>
                        </div>
                        <div className="py-4 px-4 ">
                            <div className="cursor-pointer flex items-center hover:text-sky-500 hover:border-sky-500 transition ease-in-out delay-150" onClick={handleLogout}>
                                <MdOutlineLogout/>
                                <span className="px-2">Logout</span>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                btnPlus &&(
                    <div className={`block fixed z-50 border-2 min-w-10 text-sm right-0 bg-white md:top-[65px] top-[57px] rounded-md font-light plus`}>
                        {isLogin.role !== 'student' && (
                            <div className="py-4 px-4 border-b-2">
                                <div className="flex items-center hover:text-sky-500 hover:border-sky-500 transition ease-in-out delay-150 cursor-pointer" onClick={()=>{setOpenCreat(true);setBtnPlus(false)}}>
                                    <FaUserFriends /><span className="px-2">Create classroom</span>
                                </div>
                            </div>
                        )}
                        {isLogin.role !== 'teacher' &&(
                            <div className="py-4 px-4">
                                <div className="flex items-center hover:text-sky-500 hover:border-sky-500 transition ease-in-out delay-150 cursor-pointer" onClick={()=>{setOpenJoin(true);setBtnPlus(false)}}>
                                    <FaUser /><span className="px-2">Join classroom</span>
                                </div>
                            </div>
                        )}
                        
                    </div>
                )
            }
            {openProfile && (
                <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
                    <div className="bg-white rounded-md p-4 w-[600px]">
                        <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                            <div className="flex items-center"><FaUser /><div className="ml-1">Profile</div></div>
                            <div onClick={()=>setOpenProfile(!openProfile)} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                        </div>
                        <div className="flex mt-5">
                            {/* <div className="w-full mr-2">
                                <input className="w-full border-2 py-2 px-2" type="text" name="" id="" value={isLogin.lname} />
                            </div> */}
                            <div className="w-full ml-2">
                                <input className="w-full border-2 py-2 px-2" type="text" name="" id="" value={isLogin.lname} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {openJoin && (
                <ModelJoin open={openJoin} OnClose={()=>setOpenJoin(false)} isLogin={isLogin} />
                
                
            )}
            {openCreat &&(
                <ModelCreat open={openCreat} OnClose={()=>setOpenCreat(false)} isLogin={isLogin} /> 
            )}
            

        </>
        
    )
}

export default Navbar