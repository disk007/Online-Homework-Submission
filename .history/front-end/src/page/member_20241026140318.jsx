import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import { RxCross2 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete,MdSortByAlpha } from "react-icons/md";
import {Navigate,useParams } from "react-router-dom";
import {FaUserFriends,FaUser} from "react-icons/fa";
import { ToastContainer, toast,Slide } from 'react-toastify';
import withAuthorization from "../components/with-authorization";
import axios from "axios";
const Member = ({isLogin}) => {
    const { classroomId } = useParams()
    const [sidebar,setSidebar] = useState(false)
    const [teacher,setTeacher] = useState([])
    const [member,setMember] = useState([])
    const [selected, setSelected] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [open, setOpen] = useState(false) 

    const fetchTeacher = async () => {
        const response = await axios.get(`/teacher/${classroomId}`)
        const responseData = response.data 
        setTeacher(responseData)
    }
    const fetchMembers = async () => {
        const response = await axios.get(`/members/${classroomId}`)
        const responseData = response.data 
        setMember(responseData)
        setSelected(Array(responseData.length).fill(false))
        setSelectedIds([])
    }

    const handleCheckboxChange = (index, id_classroom, id_user) => {
        const newSelected = [...selected]
        newSelected[index] = !newSelected[index] // Toggle the selected state
        setSelected(newSelected)
        
        const newSelectedIds = selectedIds.filter(item => item.id_classroom !== id_classroom || item.id_user !== id_user)

        // หาก checkbox ถูกเลือก ให้เพิ่ม id ลงใน selectedIds
        if (newSelected[index]) {
            newSelectedIds.push({ id_classroom, id_user })
        }

        setSelectedIds(newSelectedIds)
    }

    useEffect(()=>{
        fetchTeacher()
    },[])
    useEffect(()=>{
        fetchMembers()
    },[])

    const toggleAllCheckboxes = () => {
        const allSelected = selected.every(item => item) // ตรวจสอบว่าทั้งหมดถูกเลือกแล้วหรือยัง
        const newSelected = Array(member.length).fill(!allSelected) // ถ้ายังไม่ถูกเลือกทั้งหมด ให้เลือกทั้งหมด

        setSelected(newSelected)

        // ถ้าเลือกทั้งหมด ให้ใส่ id_user และ id_classroom ของทุกคนเข้าไปใน selectedIds
        if (!allSelected) {
            const allSelectedIds = member.map(data => ({
                id_classroom: data.id_classroom,
                id_user: data.id_user
            }))
            setSelectedIds(allSelectedIds)
        } else {
            // ถ้ายกเลิกการเลือกทั้งหมด ให้ล้าง selectedIds
            setSelectedIds([])
        }
    }
    const handleDelete = async () => {
        try {
            const response = await axios.delete('/delete-member',{ data: { members: selectedIds } })
            const responseData = response.data;
            if(responseData.status === 'success'){
                toast.success(responseData.message, {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
            fetchMembers()
        } catch (error) {
            console.error(error)
        }
    }
    console.log(isLogin)
    const handleCancle = () => {
        setSelected(Array(member.length).fill(false))
        setSelectedIds([])
        setOpen(!open)
    }
    if(isLogin === null){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar} />
            <ToastContainer />
            <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                    <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><FaUserFriends className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Member</div>
                </div>
                <div className="my-5 flex flex-col lg:mx-24 md:mx-16 mx-10 ">
                    <div className="text-xl font-semibold mb-2">Teacher</div>
                    <hr className="mb-2" />
                    <div className="my-2 flex items-center"><div className="border-2 p-2 rounded-full mx-3"><FaUser className="h-5 w-5" /></div><div>{teacher.name}</div></div>
                    <div className="mt-8 text-xl font-semibold mb-2 flex justify-between items-center"><div >Student</div><div className="text-sm font-normal">{member.length} student</div></div>
                    <hr className="mb-2" />
                    {isLogin && isLogin.role === 'teacher' && (

                        <div className="my-3 flex items-center">
                            <div className="mx-3"><input type="checkbox" checked={selected.every(item => item)} onChange={toggleAllCheckboxes} name="" id="" className="transform scale-150" /></div>
                            <div className="mx-3 grow"><button onClick={()=>setOpen(!open)} className={` ${selectedIds.length==0 ?'pointer-events-none bg-gray-200' : 'bg-red-600'} text-white px-4 py-1 rounded-md`}>Delete</button></div>
                            <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"><MdSortByAlpha className="h-7 w-7" /></div>
                        </div>
                    )}
                    {member.map((data,index)=>(
                        <div className="my-2 flex items-center cursor-pointer" key={index} onClick={()=>handleCheckboxChange(index,data.id_classroom,data.id_user)}>
                            {isLogin && isLogin.role == 'teacher' && (
                                <div className="mx-3">
                                    
                                    <input 
                                        type="checkbox" 
                                        checked={selected[index]} 
                                        className="transform scale-150" 
                                    />
                                    
                                </div>
                            )}
                            <div className="border-2 p-2 rounded-full ml-1 mr-2"><FaUser className="h-5 w-5" /></div>
                            <div className="grow">{data.fname+" "+data.lname}</div>
                        </div>
                    ))}
                    
                </div>
            </div>
            { open && 
                <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
                    <div className="bg-white rounded-md p-4">
                        <div className="flex justify-end"><button onClick={handleCancle} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button></div>
                        <div>Are you sure you want to delete this member?</div>
                        <div className="flex justify-end">
                            <div className="mr-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-red-500 hover:border-red-600 bg-red-500 hover:bg-red-600 transition ease-in-out delay-150" onClick={()=>{handleCancle();handleDelete()}}>Yes</button></div>
                            <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-gray-400 hover:text-gray-500 mr-2 transition ease-in-out delay-150" onClick={handleCancle}>Cancle</button></div>
                            
                        </div>
                    </div>
                </div>
            }
            
        </>
    )
}

export default withAuthorization(Member)