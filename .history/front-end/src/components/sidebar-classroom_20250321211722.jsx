import React,{useState,useEffect} from "react";
import { FaRegComment,FaUserFriends} from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { Link,useLocation,useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuRefreshCw } from "react-icons/lu";
import axios from "axios";
import useAuth from "./use-auth";
const SidebarClassroom = ({sidebar,setSidebar}) =>{
    const data = useAuth()
    const path = useLocation()
    const [reCode,setReCode] = useState(false)
    const { classroomId } = useParams()
    const [sideClass,SetSideClass] = useState('')
    const [classroom,setClassroom] = useState([])

    useEffect(()=>{
        SetSideClass(path.pathname)
    },[path])

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

    const extractFirstChars = (name) => {
        if (!name) return '';
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

    const fetchRoom = async () => {
        try {
            const response = await axios.get(`/detail_classroom/${classroomId}`);
            const responseData = response.data; 
            setClassroom(responseData);
        } catch (error) {
            console.log(error);
        }
        
    }
    useEffect(()=>{
        fetchRoom()
    },[])

    const re_code = async () => {
        try {
            const data = new FormData()
            data.append('classroom_id', classroomId);
            const response = await axios.post(`/re-code`,data,{
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                setReCode(!reCode)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <>
            <div className="md:ml-32 ml-[6rem]  bg-white border-r-2 w-72 h-screen fixed hidden lg:block bg-gray-50 overflow-y-auto">
                <div className="pl-5 text-lg font-medium border-b-2 py-3 sticky top-0 bg-gray-100"><Link to={'/'} className="flex items-center hover:text-sky-500 transition ease-in-out delay-150"><IoChevronBack className="w-6 h-6" /> <span className="ml-1">All classroom</span></Link></div>
                
                <div className="mx-3 mt-4 bg-fuchsia-500 text-white p-2 flex items-center justify-center w-16 h-16 rounded-md text-2xl ">{extractFirstChars(classroom.name)}</div>
                <div className="mx-3 mt-3 line-clamp-1 cursor-default font-bold text-lg" title={classroom.name}>{classroom.name}</div>
                    <ul className="mx-3 mt-4 list-none">
                        <div  className="inline-block">
                            <li ><Link to={`/detail-classroom/post/${classroomId}`} className={`flex items-center hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('post') ? "font-bold" : ''}`}><FaRegComment /><span className={`ml-2`}>Post</span></Link></li>
                            <div className={`${sideClass.includes('post') ? "bg-sky-500  h-1 rounded" : ""}`}></div>
                        </div><br />
                        <div className="inline-block">
                                {data && data.role !== 'student'  &&(
                                    <>
                                        <li ><Link to={`/detail-classroom/list-assignments/${classroomId}`} className={`flex items-center mt-2 hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('list') || sideClass.includes('detail-assignment') ? "font-bold" : ''}`}><GoChecklist /><span className={`ml-2`}>Assignment</span></Link></li>
                                        <div className={`${sideClass.includes('list') || sideClass.includes('detail-assignment') ? "bg-sky-500  h-1 rounded" : ""}`}></div>
                                    </>
                                    
                                )}
                                {data && data.role === 'student' &&(
                                    <>
                                        <li ><Link to={`/detail-classroom/up-comming/${classroomId}`} className={`flex items-center mt-2 hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('up') || sideClass.includes('past') || sideClass.includes('compl') || sideClass.includes('send')  ? "font-bold" : ''}`}><GoChecklist /><span className="ml-2">Assignment</span></Link></li>
                                        <div className={`${sideClass.includes('up') || sideClass.includes('past') || sideClass.includes('compl') || sideClass.includes('send') ? "bg-sky-500 w-[8.7rem] h-1 rounded" : ""}`}></div>
                                    </>
                                )}
                        </div><br />
                        <div  className="inline-block">
                            <li ><Link to={`/detail-classroom/member/${classroomId}`} className={`flex items-center mt-2 hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('member') ? "font-bold" : ''}`}><FaUserFriends /><span className={`ml-2`}>Member</span></Link></li>
                            <div className={`${sideClass.includes('member') ? "bg-sky-500  h-1 rounded" : ""}`}></div>
                        </div>
                    </ul>
                    {data && data.role !== 'student' && (
                        <div className="border-2 mx-2 rounded mt-1">
                            <div className="flex items-center justify-between  mt-1 ">
                                <div className="text-lg ml-1">Class code</div>
                                <div className="mr-3 cursor-pointer" onClick={()=>setReCode(!reCode)}><LuRefreshCw /></div>
                            </div>
                            <div className="text-sky-600 text-lg font-medium ml-1">{classroom.code}</div>
                        </div>
                    )}
            </div>
            {
                (sidebar &&
                    <div className={`md:ml-32 ml-[6rem] bg-white border-r-2 w-72 h-screen fixed bg-gray-50 lg:hidden block overflow-y-auto z-40 sidebar `}>
                        <div className="px-5 flex items-center justify-between text-lg font-medium border-b-2 py-3 sticky top-0 bg-gray-100">
                            <Link to={'/'} className="flex items-center hover:text-sky-500 transition ease-in-out delay-150"><IoChevronBack className="w-6 h-6" /> <span className="ml-1">All classroom</span></Link>
                            <RxCross2 className="hover:text-sky-500 cursor-pointer hover:w-5 hover:h-5 " onClick={() => setSidebar(false)} />
                        </div>
                
                        <div className="mx-3 mt-4 bg-fuchsia-500 text-white p-2 flex items-center justify-center w-16 h-16 rounded-md text-2xl ">{extractFirstChars(classroom.name)}</div>
                        <div className="mx-3 mt-3 line-clamp-1 cursor-default font-bold text-lg" title={classroom.name}>{classroom.name}</div>
                        <ul className="mx-3 mt-4 list-none">
                            <div  className="inline-block">
                                <li ><Link to={`/detail-classroom/post/${classroomId}`} className={`flex items-center hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('post') ? "font-bold" : ''}`}><FaRegComment /><span className={`ml-2`}>Post</span></Link></li>
                                <div className={`${sideClass.includes('post') ? "bg-sky-500  h-1 rounded" : ""}`}></div>
                            </div>
                            <br />
                            <div className="inline-block">
                                {data && data.role === 'teacher' &&(
                                    <>
                                        <li ><Link to={`/detail-classroom/list-assignments/${classroomId}`} className={`flex items-center mt-2 hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('list') || sideClass.includes('detail-assignment') ? "font-bold" : ''}`}><GoChecklist /><span className={`ml-2`}>Assignment</span></Link></li>
                                        <div className={`${sideClass.includes('list') || sideClass.includes('detail-assignment') ? "bg-sky-500  h-1 rounded" : ""}`}></div>
                                    </>
                                    
                                )}
                                {data && data.role === 'student' &&(
                                    <>
                                        <li ><Link to={`/detail-classroom/up-comming/${classroomId}`} className={`flex items-center mt-2 hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('up') || sideClass.includes('past') || sideClass.includes('compl') || sideClass.includes('send') ? "font-bold" : ''}`}><GoChecklist /><span className="ml-2">Assignment</span></Link></li>
                                        <div className={`${sideClass.includes('up') || sideClass.includes('past') || sideClass.includes('compl') || sideClass.includes('send') ? "bg-sky-500 w-[8.7rem] h-1 rounded" : ""}`}></div>
                                    </>
                                )}
                                
                            </div><br />
                            <div  className="inline-block">
                                <li ><Link to={`/detail-classroom/member/${classroomId}`} className={`flex items-center mt-2 hover:text-sky-500 text-lg transition ease-in-out delay-150 ${sideClass.includes('member') ? "font-bold" : ''}`}><FaUserFriends /><span className={`ml-2`}>Member</span></Link></li>
                                <div className={`${sideClass.includes('member') ? "bg-sky-500  h-1 rounded" : ""}`}></div>
                            </div>
                        </ul>
                        {data && data.role === 'teacher' && (
                            <div className="border-2 mx-2 rounded mt-1">
                                <div className="flex items-center justify-between  mt-1">
                                    <div className="text-lg ml-1">Class code</div>
                                    <div className="mr-3 cursor-pointer" onClick={()=>setReCode(!reCode)}><LuRefreshCw /></div>
                                </div>
                                <div className="text-sky-600 text-lg font-medium ml-1">{classroom.code}</div>
                            </div>
                        )}
                        
                    </div>
                )
            }
            {
                reCode && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setReCode(!reCode)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you want to change the classroom code ?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setReCode(!reCode)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={re_code}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default SidebarClassroom